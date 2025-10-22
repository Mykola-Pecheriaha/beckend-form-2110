import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ConsultationFormData } from '@/types/consultation'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log('=== POST /api/consultations ===')
    console.log('Received data:', body)

    // Валідація обов'язкових полів
    if (!body.name || !body.gender) {
      console.log('Validation failed - missing required fields')
      return NextResponse.json(
        { error: "Відсутні обов'язкові поля: ім'я та стать" },
        { status: 400 }
      )
    }

    // Перетворюємо дані для збереження в базу
    const consultationData = {
      ...body,
      painLevel: parseInt(body.painLevel, 10) || 0,
      examinations: JSON.stringify(body.examinations || []), // Перетворюємо масив в JSON рядок
    }

    console.log('Creating consultation with data:', consultationData)
    const consultation = await prisma.consultation.create({
      data: consultationData,
    })

    console.log('Created consultation:', consultation)
    return NextResponse.json({ success: true, id: consultation.id })
  } catch (error) {
    console.error('Error in POST:', error)
    return NextResponse.json(
      { error: 'Помилка створення консультації' },
      { status: 500 }
    )
  }
}
export async function GET() {
  try {
    console.log('=== GET /api/consultations ===')
    console.log('Environment:', process.env.NODE_ENV)
    console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL)
    
    const consultations = await prisma.consultation.findMany({
      orderBy: { createdAt: 'desc' },
    })

    console.log('Raw consultations from DB:', consultations)

    // Перетворюємо JSON рядки examinations назад в масиви
    const consultationsWithParsedExaminations = consultations.map(
      consultation => ({
        ...consultation,
        examinations: consultation.examinations
          ? JSON.parse(consultation.examinations)
          : [],
      })
    )

    console.log(
      'Found consultations:',
      consultationsWithParsedExaminations.length
    )
    console.log('Processed consultations:', consultationsWithParsedExaminations)
    
    return NextResponse.json(consultationsWithParsedExaminations)
  } catch (error) {
    console.error('Error fetching consultations:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    const errorStack = error instanceof Error ? error.stack : undefined
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch consultations',
        details: errorMessage,
        stack: process.env.NODE_ENV === 'development' ? errorStack : undefined
      },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'ID консультації не вказано' },
        { status: 400 }
      )
    }

    console.log('=== DELETE /api/consultations ===')
    console.log('Deleting consultation with ID:', id)

    const deletedConsultation = await prisma.consultation.delete({
      where: { id: parseInt(id, 10) },
    })

    console.log('Deleted consultation:', deletedConsultation)
    return NextResponse.json({
      success: true,
      message: 'Консультацію видалено успішно',
      id: deletedConsultation.id,
    })
  } catch (error) {
    console.error('Error deleting consultation:', error)
    return NextResponse.json(
      { error: 'Помилка видалення консультації' },
      { status: 500 }
    )
  }
}
