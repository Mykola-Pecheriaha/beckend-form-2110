import { NextResponse } from 'next/server'
import { consultationQueries } from '@/lib/database'

export async function GET() {
  const diagnostics = {
    timestamp: new Date().toISOString(),
    environment: {
      NODE_ENV: process.env.NODE_ENV,
      VERCEL_ENV: process.env.VERCEL_ENV,
      VERCEL: process.env.VERCEL,
      databaseUrlExists: !!process.env.DATABASE_URL,
      databaseUrlPrefix: process.env.DATABASE_URL
        ? process.env.DATABASE_URL.substring(0, 20) + '...'
        : 'N/A',
    },
    system: {
      platform: process.platform,
      nodeVersion: process.version,
      cwd: process.cwd(),
    },
    database: {
      type: 'PostgreSQL (direct client)',
      connection: 'unknown',
      consultationsCount: 0,
    },
  }

  // Test database connection
  try {
    const connectionTest = await consultationQueries.testConnection()
    if (connectionTest.success) {
      diagnostics.database.connection = 'successful'
      diagnostics.database.consultationsCount = await consultationQueries.count()
    } else {
      diagnostics.database.connection = `failed: ${connectionTest.error}`
    }
  } catch (error) {
    diagnostics.database.connection = `error: ${error instanceof Error ? error.message : 'Unknown error'}`
  }

  return NextResponse.json({
    status: 'diagnostic',
    message: 'PostgreSQL Direct Client - No Prisma dependencies',
    data: diagnostics,
  })
}
