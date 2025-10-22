import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Створюємо Prisma клієнт з правильною конфігурацією для середовища
const createPrismaClient = () => {
  const isProduction =
    process.env.NODE_ENV === 'production' ||
    process.env.VERCEL_ENV === 'production'

  console.log('Prisma client initialization:', {
    environment: process.env.NODE_ENV,
    vercelEnv: process.env.VERCEL_ENV,
    isProduction,
    dbConnectionString: process.env.DB_CONNECTION_STRING
      ? '***CONFIGURED***'
      : 'NOT_SET',
    databaseUrl: process.env.DATABASE_URL ? '***CONFIGURED***' : 'NOT_SET',
  })

  // Динамічно визначаємо URL бази даних з множинними fallback варіантами
  let databaseUrl =
    process.env.DB_CONNECTION_STRING ||
    process.env.DATABASE_URL ||
    process.env.POSTGRES_PRISMA_URL ||
    process.env.POSTGRES_URL

  console.log('Database URL resolution:', {
    dbConnectionString: !!process.env.DB_CONNECTION_STRING,
    databaseUrl: !!process.env.DATABASE_URL,
    postgresPrismaUrl: !!process.env.POSTGRES_PRISMA_URL,
    postgresUrl: !!process.env.POSTGRES_URL,
    resolved: !!databaseUrl,
    urlType: databaseUrl ? databaseUrl.split(':')[0] : 'none',
  })

  if (!databaseUrl) {
    if (isProduction) {
      throw new Error(
        'No database URL found! Please set one of: DB_CONNECTION_STRING, DATABASE_URL, POSTGRES_PRISMA_URL, or POSTGRES_URL in Vercel environment variables'
      )
    } else {
      // Для розробки використовуємо SQLite
      databaseUrl = 'file:./dev.db'
    }
  }

  return new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'info', 'warn', 'error']
        : ['error'],
    datasources: {
      db: {
        url: databaseUrl,
      },
    },
  })
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
