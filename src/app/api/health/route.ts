import { NextResponse } from 'next/server'
import { testPrismaConnection } from '@/lib/prisma-programmatic'

export async function GET() {
  const healthInfo = {
    status: 'unknown',
    environment: process.env.NODE_ENV,
    vercelEnv: process.env.VERCEL_ENV,
    database: 'unknown',
    consultationsCount: 0,
    timestamp: new Date().toISOString(),
    diagnostics: {} as any,
    connectionTest: {} as any
  }

  try {
    console.log('=== Health Check with Programmatic Prisma ===')
    console.log('Environment:', process.env.NODE_ENV)
    console.log('VERCEL_ENV:', process.env.VERCEL_ENV)
    console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL)

    // Додаткова діагностика
    healthInfo.diagnostics = {
      databaseUrlExists: !!process.env.DATABASE_URL,
      databaseType: process.env.DATABASE_URL ? process.env.DATABASE_URL.split(':')[0] : 'unknown',
      nodeVersion: process.version,
      platform: process.platform,
      vercel: process.env.VERCEL || 'false'
    }

    // Test programmatic Prisma connection
    console.log('Testing programmatic Prisma connection...')
    const connectionResult = await testPrismaConnection()
    healthInfo.connectionTest = connectionResult

    if (connectionResult.success) {
      healthInfo.status = 'ok'
      healthInfo.database = 'connected'
      
      // Try to import regular prisma client as fallback
      try {
        const { prisma } = await import('@/lib/prisma-programmatic')
        const count = await prisma.consultation.count()
        healthInfo.consultationsCount = count
        console.log('✅ Consultation count:', count)
      } catch (countError) {
        console.warn('Could not count consultations:', countError)
        healthInfo.diagnostics.countError = countError instanceof Error ? countError.message : 'Unknown error'
      }
    } else {
      healthInfo.status = 'error'
      healthInfo.database = 'disconnected'
      healthInfo.diagnostics.connectionError = connectionResult.error
    }

    console.log('Health check completed:', healthInfo.status)
    
    return NextResponse.json(healthInfo)
    
  } catch (error) {
    console.error('Health check failed:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    
    healthInfo.status = 'error'
    healthInfo.database = 'disconnected'
    healthInfo.diagnostics.error = errorMessage
    healthInfo.diagnostics.errorStack = error instanceof Error ? error.stack : undefined

    return NextResponse.json(healthInfo, { status: 500 })
  }
}
