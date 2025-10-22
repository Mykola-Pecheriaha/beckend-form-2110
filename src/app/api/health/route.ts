import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const healthInfo = {
    status: 'unknown',
    environment: process.env.NODE_ENV,
    vercelEnv: process.env.VERCEL_ENV,
    database: 'unknown',
    consultationsCount: 0,
    timestamp: new Date().toISOString(),
    diagnostics: {} as any
  }

  try {
    console.log('=== Health Check ===')
    console.log('Environment:', process.env.NODE_ENV)
    console.log('VERCEL_ENV:', process.env.VERCEL_ENV)
    console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL)

    // Додаткова діагностика
    healthInfo.diagnostics = {
      databaseUrlExists: !!process.env.DATABASE_URL,
      databaseType: process.env.DATABASE_URL ? process.env.DATABASE_URL.split(':')[0] : 'unknown',
      nodeVersion: process.version,
      platform: process.platform
    }

    // Спробуємо підключитися до бази
    console.log('Attempting database connection...')
    await prisma.$connect()
    console.log('✅ Database connected successfully')
    healthInfo.database = 'connected'

    // Спробуємо виконати простий запит
    console.log('Testing table access...')
    const count = await prisma.consultation.count()
    console.log('✅ Consultations table accessible, count:', count)
    
    healthInfo.consultationsCount = count
    healthInfo.status = 'ok'

    // Спробуємо отримати одну консультацію для тесту
    const latestConsultation = await prisma.consultation.findFirst({
      orderBy: { createdAt: 'desc' }
    })
    
    healthInfo.diagnostics.hasData = !!latestConsultation
    healthInfo.diagnostics.latestConsultationDate = latestConsultation?.createdAt

    console.log('Health check completed successfully')
    
    return NextResponse.json(healthInfo)
    
  } catch (error) {
    console.error('Health check failed:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    const errorCode = (error as any)?.code || 'UNKNOWN'
    
    healthInfo.status = 'error'
    healthInfo.database = 'disconnected'
    healthInfo.diagnostics.error = errorMessage
    healthInfo.diagnostics.errorCode = errorCode
    healthInfo.diagnostics.errorStack = error instanceof Error ? error.stack : undefined

    // Спеціальна діагностика для різних типів помилок
    if (errorMessage.includes('does not exist')) {
      healthInfo.diagnostics.suggestion = 'Таблиця не існує - потрібно запустити міграції'
    } else if (errorMessage.includes('connect')) {
      healthInfo.diagnostics.suggestion = 'Проблема підключення до бази даних'
    } else if (errorMessage.includes('timeout')) {
      healthInfo.diagnostics.suggestion = 'Таймаут підключення до бази даних'
    }

    return NextResponse.json(healthInfo, { status: 500 })
  } finally {
    try {
      await prisma.$disconnect()
    } catch (disconnectError) {
      console.warn('Warning: Could not disconnect from database:', disconnectError)
    }
  }
}
