const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function createTestData() {
  try {
    console.log('Creating test consultation...')

    const consultation = await prisma.consultation.create({
      data: {
        name: 'Тестовий Пацієнт',
        age: 35,
        gender: 'Чоловік',
        phone: '+380123456789',
        height: 175,
        weight: 70,
        complaints: 'Головний біль',
        examinations: '["Огляд", "Аналізи"]',
        hasChronicDiseases: false,
        takesMedications: false,
        painLevel: 5,
        hasAllergy: false,
        additionalNotes: 'Тестова консультація для перевірки',
      },
    })

    console.log('Created consultation:', consultation)

    // Перевіримо всі консультації
    const allConsultations = await prisma.consultation.findMany()
    console.log('All consultations:', allConsultations)
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createTestData()
