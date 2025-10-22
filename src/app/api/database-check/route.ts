import { NextResponse } from 'next/server'

export async function GET() {
  const diagnostics = {
    timestamp: new Date().toISOString(),
    environment: {
      NODE_ENV: process.env.NODE_ENV,
      VERCEL_ENV: process.env.VERCEL_ENV,
      VERCEL: process.env.VERCEL,
      VERCEL_URL: process.env.VERCEL_URL,
      region: process.env.VERCEL_REGION,
    },
    databaseConfig: {
      DATABASE_URL: process.env.DATABASE_URL ? 'SET (hidden)' : '❌ NOT SET',
      DB_CONNECTION_STRING: process.env.DB_CONNECTION_STRING ? 'SET (hidden)' : '❌ NOT SET',
      POSTGRES_URL: process.env.POSTGRES_URL ? 'SET (hidden)' : '❌ NOT SET',
      
      databaseUrlPrefix: process.env.DATABASE_URL 
        ? process.env.DATABASE_URL.substring(0, 20) + '...'
        : '❌ NOT CONFIGURED',
      
      hasAnyDbUrl: !!(
        process.env.DATABASE_URL || 
        process.env.DB_CONNECTION_STRING || 
        process.env.POSTGRES_URL
      )
    },
    system: {
      platform: process.platform,
      nodeVersion: process.version,
      memoryUsage: process.memoryUsage(),
    },
    instructions: {
      problem: !process.env.DATABASE_URL ? 'DATABASE_URL not configured in Vercel' : null,
      solution: !process.env.DATABASE_URL ? [
        '1. Create database: https://supabase.com or https://neon.tech',
        '2. Copy PostgreSQL connection string',
        '3. Go to Vercel Dashboard → Your Project → Settings → Environment Variables',
        '4. Add: Name=DATABASE_URL, Value=your_connection_string',
        '5. Save and Redeploy',
        '6. Check this endpoint again'
      ] : ['✅ Database URL configured correctly!']
    }
  }

  const status = diagnostics.databaseConfig.hasAnyDbUrl ? 200 : 500

  return NextResponse.json(diagnostics, { status })
}