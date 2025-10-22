import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Додамо інформацію про підключення
console.log('Prisma client initialized:', {
  environment: process.env.NODE_ENV,
  databaseUrl: process.env.DATABASE_URL ? '***HIDDEN***' : 'NOT_SET',
})
