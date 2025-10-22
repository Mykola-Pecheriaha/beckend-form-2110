const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function testDatabase() {
  try {
    console.log('🔍 Testing database connection...')
    
    // Перевірка підключення
    await prisma.$connect()
    console.log('✅ Database connected successfully')
    
    // Підрахунок консультацій
    const count = await prisma.consultation.count()
    console.log(`📊 Total consultations: ${count}`)
    
    // Отримання всіх консультацій
    const consultations = await prisma.consultation.findMany({
      orderBy: { createdAt: 'desc' },
      take: 3 // Беремо тільки останні 3 для тесту
    })
    
    console.log('📝 Recent consultations:')
    consultations.forEach((consultation, index) => {
      console.log(`${index + 1}. ${consultation.name} (${consultation.age} років) - ${consultation.createdAt}`)
    })
    
    console.log('✅ Database test completed successfully!')
    
  } catch (error) {
    console.error('❌ Database test failed:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testDatabase()