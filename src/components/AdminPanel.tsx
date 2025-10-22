'use client'

import { useState, useEffect } from 'react'
import { ConsultationWithBMI } from '@/types/consultation'

export default function AdminPanel() {
  const [consultations, setConsultations] = useState<ConsultationWithBMI[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedConsultation, setSelectedConsultation] =
    useState<ConsultationWithBMI | null>(null)

  useEffect(() => {
    fetchConsultations()
  }, [])

  const fetchConsultations = async () => {
    try {
      console.log('=== AdminPanel: Fetching consultations ===')
      const response = await fetch('/api/consultations')
      console.log('AdminPanel: Response status:', response.status)

      const data = await response.json()
      console.log('AdminPanel: Raw data received:', data)

      // Обчислити ІМТ для кожної консультації
      const consultationsWithBMI = data.map((consultation: any) => {
        let bmi = undefined
        let bmiCategory = undefined

        if (consultation.height && consultation.weight) {
          const heightInMeters = consultation.height / 100
          bmi =
            Math.round(
              (consultation.weight / (heightInMeters * heightInMeters)) * 10
            ) / 10

          if (bmi < 18.5) bmiCategory = 'Недостатня вага'
          else if (bmi < 25) bmiCategory = 'Нормальна вага'
          else if (bmi < 30) bmiCategory = 'Надлишкова вага'
          else bmiCategory = 'Ожиріння'
        }

        return {
          ...consultation,
          createdAt: new Date(consultation.createdAt),
          bmi,
          bmiCategory,
        }
      })

      console.log(
        'AdminPanel: Processed consultations with BMI:',
        consultationsWithBMI
      )
      setConsultations(consultationsWithBMI)
    } catch (error) {
      console.error('AdminPanel: Error fetching consultations:', error)
    } finally {
      setLoading(false)
    }
  }

  const deleteConsultation = async (id: number) => {
    if (!confirm('Ви впевнені, що хочете видалити цю консультацію?')) {
      return
    }

    try {
      console.log('=== AdminPanel: Deleting consultation ===')
      console.log('Deleting consultation ID:', id)

      const response = await fetch(`/api/consultations?id=${id}`, {
        method: 'DELETE',
      })

      const data = await response.json()
      console.log('Delete response:', data)

      if (response.ok) {
        // Оновити список консультацій після видалення
        setConsultations(prev =>
          prev.filter(consultation => consultation.id !== id)
        )

        // Закрити модальне вікно, якщо видалена консультація була відкрита
        if (selectedConsultation?.id === id) {
          setSelectedConsultation(null)
        }

        alert('Консультацію видалено успішно!')
      } else {
        alert(`Помилка видалення: ${data.error}`)
      }
    } catch (error) {
      console.error('AdminPanel: Error deleting consultation:', error)
      alert('Помилка видалення консультації')
    }
  }

  const formatDate = (date: Date) => {
    return date.toLocaleString('uk-UA', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
  }

  const parseExaminations = (
    examinations: string | null | undefined
  ): string[] => {
    if (!examinations) return []
    try {
      return JSON.parse(examinations)
    } catch {
      return []
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-xl">Завантаження...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="rounded-lg bg-white p-6 shadow-lg">
        <h1 className="mb-6 text-2xl font-bold">Адмін-панель</h1>

        <div className="mb-6">
          <p className="text-lg">
            <strong>Всього консультацій: {consultations.length}</strong>
          </p>
        </div>

        {consultations.length === 0 ? (
          <div className="py-8 text-center text-gray-500">
            Поки що немає консультацій
          </div>
        ) : (
          <div className="space-y-4">
            {consultations.map((consultation, index) => (
              <div
                key={consultation.id}
                className="relative rounded-lg border border-gray-200 p-4 hover:bg-gray-50"
              >
                <div
                  className="cursor-pointer"
                  onClick={() => setSelectedConsultation(consultation)}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">
                      Консультація #{consultations.length - index} -{' '}
                      {consultation.name}
                    </h3>
                    <span className="text-sm text-gray-500">
                      {formatDate(consultation.createdAt)}
                    </span>
                  </div>
                  <p className="mt-1 text-gray-600">
                    {consultation.age} років, {consultation.gender}
                    {consultation.bmi &&
                      ` • ІМТ: ${consultation.bmi} (${consultation.bmiCategory})`}
                  </p>
                </div>

                {/* Кнопка видалення */}
                <button
                  onClick={e => {
                    e.stopPropagation() // Запобігаємо відкриттю деталей при кліку на кнопку
                    deleteConsultation(consultation.id)
                  }}
                  className="absolute right-2 top-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  title="Видалити консультацію"
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Модальне вікно з деталями */}
        {selectedConsultation && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white">
              <div className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-xl font-bold">
                    Консультація #{' '}
                    {consultations.findIndex(
                      c => c.id === selectedConsultation.id
                    ) + 1}{' '}
                    - {selectedConsultation.name}
                  </h2>
                  <div className="flex items-center space-x-2">
                    {/* Кнопка видалення */}
                    <button
                      onClick={() =>
                        deleteConsultation(selectedConsultation.id)
                      }
                      className="rounded-md bg-red-500 px-3 py-1 text-sm text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                      title="Видалити консультацію"
                    >
                      🗑️ Видалити
                    </button>
                    {/* Кнопка закриття */}
                    <button
                      onClick={() => setSelectedConsultation(null)}
                      className="text-2xl text-gray-500 hover:text-gray-700"
                    >
                      ×
                    </button>
                  </div>
                </div>

                <div className="mb-6 text-sm text-gray-500">
                  {formatDate(selectedConsultation.createdAt)}
                </div>

                <div className="space-y-6">
                  {/* Інформація про пацієнта */}
                  <div>
                    <h3 className="mb-3 flex items-center text-lg font-semibold">
                      👤 Пацієнт
                    </h3>
                    <div className="space-y-2 rounded-lg bg-gray-50 p-4">
                      <p>
                        <strong>Ім'я:</strong> {selectedConsultation.name}
                      </p>
                      <p>
                        <strong>Вік:</strong> {selectedConsultation.age} років
                      </p>
                      <p>
                        <strong>Стать:</strong> {selectedConsultation.gender}
                      </p>
                      {selectedConsultation.phone && (
                        <p>
                          <strong>Телефон:</strong> {selectedConsultation.phone}
                        </p>
                      )}
                      {selectedConsultation.height && (
                        <p>
                          <strong>Ріст:</strong> {selectedConsultation.height}{' '}
                          см
                        </p>
                      )}
                      {selectedConsultation.weight && (
                        <p>
                          <strong>Вага:</strong> {selectedConsultation.weight}{' '}
                          кг
                        </p>
                      )}
                      {selectedConsultation.bmi && (
                        <p>
                          <strong>ІМТ:</strong> {selectedConsultation.bmi} кг/м²
                          ({selectedConsultation.bmiCategory})
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Обстеження */}
                  {parseExaminations(selectedConsultation.examinations).length >
                    0 && (
                    <div>
                      <h3 className="mb-3 flex items-center text-lg font-semibold">
                        🧪 Обстеження
                      </h3>
                      <div className="rounded-lg bg-gray-50 p-4">
                        <div className="flex flex-wrap gap-2">
                          {parseExaminations(
                            selectedConsultation.examinations
                          ).map((exam, idx) => (
                            <span
                              key={idx}
                              className="rounded bg-blue-100 px-2 py-1 text-sm text-blue-800"
                            >
                              {exam}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Скарги */}
                  {selectedConsultation.complaints && (
                    <div>
                      <h3 className="mb-3 flex items-center text-lg font-semibold">
                        📝 Скарги
                      </h3>
                      <div className="rounded-lg bg-gray-50 p-4">
                        <p>{selectedConsultation.complaints}</p>
                      </div>
                    </div>
                  )}

                  {/* Медична історія */}
                  <div>
                    <h3 className="mb-3 flex items-center text-lg font-semibold">
                      🩺 Медична історія
                    </h3>
                    <div className="space-y-2 rounded-lg bg-gray-50 p-4">
                      {selectedConsultation.hasChronicDiseases &&
                        selectedConsultation.chronicDiseases && (
                          <p>
                            <strong>Хронічні хвороби:</strong>{' '}
                            {selectedConsultation.chronicDiseases}
                          </p>
                        )}
                      {selectedConsultation.takesMedications &&
                        selectedConsultation.medications && (
                          <p>
                            <strong>Приймає ліки:</strong>{' '}
                            {selectedConsultation.medications}
                          </p>
                        )}
                      {selectedConsultation.painLevel !== null &&
                        selectedConsultation.painLevel !== undefined && (
                          <p>
                            <strong>Рівень болю:</strong>{' '}
                            {selectedConsultation.painLevel}/10
                          </p>
                        )}
                      {selectedConsultation.hasAllergy &&
                        selectedConsultation.allergies && (
                          <p>
                            <strong>Алергії:</strong>{' '}
                            {selectedConsultation.allergies}
                          </p>
                        )}
                    </div>
                  </div>

                  {/* Коментарі */}
                  {selectedConsultation.additionalNotes && (
                    <div>
                      <h3 className="mb-3 flex items-center text-lg font-semibold">
                        💬 Коментарі
                      </h3>
                      <div className="rounded-lg bg-gray-50 p-4">
                        <p>{selectedConsultation.additionalNotes}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
