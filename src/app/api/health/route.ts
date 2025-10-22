import { NextResponse } from 'next/server'
import { consultationQueries } from '@/lib/database'

export async function GET() {
  try {
    console.log('🔍 Testing PostgreSQL connection...')

    // Test database connection
    const connectionTest = await consultationQueries.testConnection()

    if (!connectionTest.success) {
      throw new Error(`Database connection failed: ${connectionTest.error}`)
    }

    // Count consultations
    const consultationsCount = await consultationQueries.count()

    console.log('✅ PostgreSQL connection successful')
    console.log('✅ Database query successful')
    console.log('✅ Consultation count:', consultationsCount)

    return NextResponse.json({
      status: 'ok',
      database: 'postgresql',
      connection: 'direct-pg-client',
      consultationsCount,
      environment: process.env.NODE_ENV,
      timestamp: new Date().toISOString(),
      dbConnectionString: process.env.DB_CONNECTION_STRING
        ? 'configured'
        : 'not_set',
      databaseUrl: process.env.DATABASE_URL ? 'configured' : 'not_set',
    })
  } catch (error) {
    console.error('❌ Database connection failed:', error)
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error'

    return NextResponse.json(
      {
        status: 'error',
        database: 'postgresql',
        connection: 'direct-pg-client',
        error: errorMessage,
        environment: process.env.NODE_ENV,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    )
  }
}
