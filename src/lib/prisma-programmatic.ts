import { PrismaClient } from '@prisma/client'

// Programmatic Prisma client that bypasses schema files completely
// This is a radical approach to avoid any file-based translation issues

const createProgrammaticPrismaClient = () => {
  const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL_ENV === 'production'
  
  console.log('🔧 Programmatic Prisma client initialization:', {
    environment: process.env.NODE_ENV,
    vercelEnv: process.env.VERCEL_ENV,
    isProduction,
    databaseUrl: process.env.DATABASE_URL ? 'CONFIGURED' : 'MISSING',
    vercel: process.env.VERCEL || 'false'
  })

  // Determine database URL based on environment
  let databaseUrl: string
  
  if (isProduction) {
    databaseUrl = process.env.DATABASE_URL || ''
    if (!databaseUrl) {
      throw new Error('DATABASE_URL is required in production environment')
    }
    console.log('🚀 Production mode: Using PostgreSQL database')
  } else {
    databaseUrl = process.env.DATABASE_URL || 'file:./dev.db'
    console.log('🧪 Development mode: Using SQLite database')
  }

  console.log('📋 Database URL info:', {
    type: databaseUrl.split(':')[0],
    configured: !!databaseUrl
  })

  try {
    const client = new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
      datasources: {
        db: {
          url: databaseUrl
        }
      },
      // Force the client to ignore any schema provider mismatches
      errorFormat: 'pretty',
    })

    console.log('✅ Programmatic Prisma client created successfully')
    return client
    
  } catch (error) {
    console.error('❌ Failed to create Prisma client:', error)
    throw error
  }
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? createProgrammaticPrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

// Test connection function
export const testPrismaConnection = async () => {
  try {
    console.log('🔍 Testing Prisma connection...')
    await prisma.$connect()
    console.log('✅ Prisma connection successful')
    
    // Try a simple query
    const result = await prisma.$queryRaw`SELECT 1 as test`
    console.log('✅ Database query successful:', result)
    
    return { success: true, result }
  } catch (error) {
    console.error('❌ Prisma connection failed:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  } finally {
    await prisma.$disconnect()
  }
}