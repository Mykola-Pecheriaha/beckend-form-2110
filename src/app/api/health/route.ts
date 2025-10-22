import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    console.log('🔍 Testing Prisma connection...')

    // Simple connection test
    await prisma.$queryRaw`SELECT 1 as test`

    // Count consultations (convert BigInt to Number)
    const count = await prisma.consultation.count()
    const consultationsCount = Number(count)

    console.log('✅ Prisma connection successful')
    console.log('✅ Database query successful')
    console.log('✅ Consultation count:', consultationsCount)

    return NextResponse.json({
      status: 'ok',
      database: 'connected',
      consultationsCount,
      environment: process.env.NODE_ENV,
      timestamp: new Date().toISOString(),
      dbConnectionString: process.env.DB_CONNECTION_STRING
        ? 'configured'
        : 'not_set',
      databaseUrl: process.env.DATABASE_URL ? 'configured' : 'not_set',
    })
  } catch (error) {
    console.error('❌ Prisma connection failed:', error)
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error'

    return NextResponse.json(
      {
        status: 'error',
        database: 'disconnected',
        error: errorMessage,
        environment: process.env.NODE_ENV,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    )
  }
}
