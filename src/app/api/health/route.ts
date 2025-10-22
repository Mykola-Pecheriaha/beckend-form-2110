import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    console.log('=== Health Check ===')
    console.log('Environment:', process.env.NODE_ENV)
    console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL)
    
    // Спробуємо підключитися до бази
    await prisma.$connect()
    
    // Спробуємо виконати простий запит
    const count = await prisma.consultation.count()
    
    console.log('Database connection successful, consultations count:', count)
    
    return NextResponse.json({
      status: 'ok',
      environment: process.env.NODE_ENV,
      database: 'connected',
      consultationsCount: count,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Health check failed:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    
    return NextResponse.json(
      {
        status: 'error',
        error: errorMessage,
        environment: process.env.NODE_ENV,
        database: 'disconnected',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}