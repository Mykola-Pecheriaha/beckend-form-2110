import { NextResponse } from 'next/server'

export async function GET() {
  const diagnostics = {
    timestamp: new Date().toISOString(),
    environment: {
      NODE_ENV: process.env.NODE_ENV,
      VERCEL_ENV: process.env.VERCEL_ENV,
      VERCEL: process.env.VERCEL,
      databaseUrlExists: !!process.env.DATABASE_URL,
      databaseUrlPrefix: process.env.DATABASE_URL ? process.env.DATABASE_URL.substring(0, 20) + '...' : 'N/A'
    },
    system: {
      platform: process.platform,
      nodeVersion: process.version,
      cwd: process.cwd()
    },
    files: {
      schemaExists: false,
      schemaContent: 'N/A'
    }
  }

  // Try to read schema file
  try {
    const fs = await import('fs')
    const path = await import('path')
    
    const schemaPath = path.join(process.cwd(), 'prisma', 'schema.prisma')
    if (fs.existsSync(schemaPath)) {
      diagnostics.files.schemaExists = true
      diagnostics.files.schemaContent = fs.readFileSync(schemaPath, 'utf-8')
    }
  } catch (error) {
    diagnostics.files.schemaContent = `Error reading schema: ${error}`
  }

  return NextResponse.json({
    status: 'diagnostic',
    data: diagnostics
  })
}