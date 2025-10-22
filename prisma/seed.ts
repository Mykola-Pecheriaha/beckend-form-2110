import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Створити тестову консультацію
  const consultation = await prisma.consultation.create({
    data: {
      name: 'Микола',
      age: 57,
      gender: 'Чоловік',
      phone: '+380507575411',
      height: 178,
      weight: 141,
      complaints: 'болить в боку',
      examinations: JSON.stringify(['Огляд', 'Рентген', 'УЗД', 'КТ']),
      hasChronicDiseases: true,
      chronicDiseases: 'гіпертонія',
      takesMedications: true,
      medications: 'аналгін',
      painLevel: 4,
      hasAllergy: false,
      allergies: null,
      additionalNotes: 'болить давно',
    },
  })

  console.log('Створена тестова консультація:', consultation)
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
