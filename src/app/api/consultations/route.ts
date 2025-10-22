import { NextResponse } from 'next/server'
import { consultationQueries } from '@/lib/database'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log('=== POST /api/consultations ===')

    if (!body.name || !body.gender) {
      return NextResponse.json(
        { error: "Відсутні обов'язкові поля: ім'я та стать" },
        { status: 400 }
      )
    }

    const connectionTest = await consultationQueries.testConnection()
    if (!connectionTest.success) {
      return NextResponse.json(
        { error: 'Помилка підключення до бази даних' },
        { status: 500 }
      )
    }

    const consultationData = {
      name: body.name,
      age: parseInt(body.age, 10) || null,
      gender: body.gender,
      phone: body.phone || null,
      height: parseInt(body.height, 10) || null,
      weight: parseInt(body.weight, 10) || null,
      complaints: body.complaints || null,
      examinations: JSON.stringify(body.examinations || []),
      chronic_diseases: body.chronicDiseases || null,
      has_chronic_diseases: !!body.hasChronicDiseases,
      medications: body.medications || null,
      takes_medications: !!body.takesMedications,
      pain_level: parseInt(body.painLevel, 10) || null,
      has_allergy: !!body.hasAllergy,
      allergies: body.allergies || null,
      additional_notes: body.additionalNotes || null,
    }

    const consultation = await consultationQueries.create(consultationData)
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
    const consultations = await consultationQueries.getAll()
    const result = consultations.map(consultation => ({
      ...consultation,
      examinations: consultation.examinations ? JSON.parse(consultation.examinations) : [],
    }))
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error fetching consultations:', error)
    return NextResponse.json(
      { error: 'Failed to fetch consultations' },
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

    const deleted = await consultationQueries.delete(parseInt(id, 10))
    if (deleted) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json(
        { error: 'Консультацію не знайдено' },
        { status: 404 }
      )
    }
  } catch (error) {
    console.error('Error deleting consultation:', error)
    return NextResponse.json(
      { error: 'Помилка видалення консультації' },
      { status: 500 }
    )
  }
}
