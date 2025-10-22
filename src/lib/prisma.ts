import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Створюємо Prisma клієнт з правильною конфігурацією для середовища
const createPrismaClient = () => {
  const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL_ENV === 'production'
  
  console.log('Prisma client initialization:', {
    environment: process.env.NODE_ENV,
    vercelEnv: process.env.VERCEL_ENV,
    isProduction,
    databaseUrl: process.env.DATABASE_URL ? '***CONFIGURED***' : 'NOT_SET',
  })

  // Динамічно визначаємо URL бази даних
  let databaseUrl = process.env.DATABASE_URL
  
  if (!databaseUrl) {
    if (isProduction) {
      throw new Error('DATABASE_URL is required in production environment')
    } else {
      // Для розробки використовуємо SQLite
      databaseUrl = 'file:./dev.db'
    }
  }

  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
    datasources: {
      db: {
        url: databaseUrl
      }
    }
  })
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
