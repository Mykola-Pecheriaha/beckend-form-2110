'use client'

import { useState } from 'react'
import { ConsultationFormData } from '@/types/consultation'

const EXAMINATION_OPTIONS = [
  'Огляд',
  'Аналізи',
  'ЕКГ',
  'Рентген',
  'УЗД',
  'КТ',
  'МРТ',
]

export default function ConsultationForm() {
  const [formData, setFormData] = useState<ConsultationFormData>({
    name: '',
    age: undefined, // Початково порожнє поле
    gender: '',
    phone: '',
    height: undefined,
    weight: undefined,
    complaints: '',
    examinations: [],
    hasChronicDiseases: false,
    chronicDiseases: '',
    takesMedications: false,
    medications: '',
    painLevel: 0,
    hasAllergy: false,
    allergies: '',
    additionalNotes: '',
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState<string | null>(null)

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked

    setFormData(prev => ({
      ...prev,
      [name]:
        type === 'checkbox'
          ? checked
          : type === 'number'
            ? Number(value) || undefined // Для всіх числових полів
            : value,
    }))
  }

  const handleExaminationChange = (exam: string) => {
    setFormData(prev => ({
      ...prev,
      examinations: prev.examinations.includes(exam)
        ? prev.examinations.filter(e => e !== exam)
        : [...prev.examinations, exam],
    }))
  }

  // Функція для розрахунку ІМТ
  const calculateBMI = () => {
    if (formData.height && formData.weight) {
      const heightInMeters = formData.height / 100
      return (formData.weight / (heightInMeters * heightInMeters)).toFixed(1)
    }
    return null
  }

  // Функція для визначення категорії ІМТ
  const getBMICategory = (bmi: string) => {
    const bmiValue = parseFloat(bmi)
    if (bmiValue < 18.5)
      return { text: 'Недостатня вага', color: 'text-blue-600' }
    if (bmiValue < 25)
      return { text: 'Нормальна вага', color: 'text-green-600' }
    if (bmiValue < 30)
      return { text: 'Надлишкова вага', color: 'text-yellow-600' }
    return { text: 'Ожиріння', color: 'text-red-600' }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitMessage(null)

    try {
      const response = await fetch('/api/consultations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const responseData = await response.json()

      if (response.ok) {
        setSubmitMessage('✅ Консультацію успішно надіслано!')

        // Очистити повідомлення через 5 секунд
        setTimeout(() => {
          setSubmitMessage(null)
        }, 5000)

        // Очистити форму
        setFormData({
          name: '',
          age: undefined, // Порожнє поле після очищення
          gender: '',
          phone: '',
          height: undefined,
          weight: undefined,
          complaints: '',
          examinations: [],
          hasChronicDiseases: false,
          chronicDiseases: '',
          takesMedications: false,
          medications: '',
          painLevel: 0,
          hasAllergy: false,
          allergies: '',
          additionalNotes: '',
        })
      } else {
        const errorMessage = responseData.error || 'Failed to submit'
        setSubmitMessage(`❌ Помилка: ${errorMessage}`)
      }
    } catch (error) {
      setSubmitMessage('❌ Помилка при надсиланні форми')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl rounded-lg bg-white p-6 shadow-lg">
      <h1 className="mb-6 text-center text-2xl font-bold">
        Форма консультації
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Інформація про пацієнта */}
        <div className="rounded-lg bg-blue-50 p-4">
          <h2 className="mb-4 flex items-center text-lg font-semibold">
            👤 Інформація про пацієнта
          </h2>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">Ім'я *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full rounded-md border border-gray-300 p-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Вік</label>
              <input
                type="number"
                name="age"
                value={formData.age || ''}
                onChange={handleInputChange}
                min="0"
                max="120"
                className="w-full rounded-md border border-gray-300 p-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Стать</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className="w-full rounded-md border border-gray-300 p-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Оберіть</option>
                <option value="Чоловік">Чоловік</option>
                <option value="Жінка">Жінка</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Телефон</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full rounded-md border border-gray-300 p-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Ріст (см)
              </label>
              <input
                type="number"
                name="height"
                value={formData.height || ''}
                onChange={handleInputChange}
                min="50"
                max="250"
                className="w-full rounded-md border border-gray-300 p-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Вага (кг)
              </label>
              <input
                type="number"
                name="weight"
                value={formData.weight || ''}
                onChange={handleInputChange}
                min="10"
                max="300"
                className="w-full rounded-md border border-gray-300 p-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Відображення ІМТ */}
          {calculateBMI() && (
            <div className="mt-4 rounded-lg border border-blue-200 bg-gradient-to-r from-blue-50 to-green-50 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-700">
                    Індекс маси тіла (ІМТ)
                  </h3>
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold text-blue-600">
                      {calculateBMI()}
                    </span>
                    <span
                      className={`text-sm font-medium ${getBMICategory(calculateBMI()!).color}`}
                    >
                      {getBMICategory(calculateBMI()!).text}
                    </span>
                  </div>
                </div>
                <div className="text-right text-xs text-gray-500">
                  <div>Нормальна вага: 18.5-24.9</div>
                  <div>Формула: вага/(ріст²)</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Скарги пацієнта */}
        <div className="rounded-lg bg-orange-50 p-4">
          <h2 className="mb-4 flex items-center text-lg font-semibold">
            📝 Скарги пацієнта
          </h2>
          <textarea
            name="complaints"
            value={formData.complaints}
            onChange={handleInputChange}
            placeholder="Опишіть скарги"
            rows={4}
            className="w-full rounded-md border border-gray-300 p-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Обстеження */}
        <div className="rounded-lg bg-green-50 p-4">
          <h2 className="mb-4 flex items-center text-lg font-semibold">
            🧪 Які маєте обстеження
          </h2>
          <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
            {EXAMINATION_OPTIONS.map(exam => (
              <label
                key={exam}
                className="flex cursor-pointer items-center space-x-2"
              >
                <input
                  type="checkbox"
                  checked={formData.examinations.includes(exam)}
                  onChange={() => handleExaminationChange(exam)}
                  className="rounded text-blue-600"
                />
                <span className="text-sm">{exam}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Медична історія */}
        <div className="rounded-lg bg-purple-50 p-4">
          <h2 className="mb-4 flex items-center text-lg font-semibold">
            🩺 Медична історія
          </h2>

          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium">
                Чи є хронічні хвороби?
              </label>
              <div className="mb-2 flex space-x-4">
                <label className="flex cursor-pointer items-center">
                  <input
                    type="radio"
                    name="hasChronicDiseases"
                    checked={formData.hasChronicDiseases}
                    onChange={() =>
                      setFormData(prev => ({
                        ...prev,
                        hasChronicDiseases: true,
                      }))
                    }
                    className="mr-1"
                  />
                  Так
                </label>
                <label className="flex cursor-pointer items-center">
                  <input
                    type="radio"
                    name="hasChronicDiseases"
                    checked={!formData.hasChronicDiseases}
                    onChange={() =>
                      setFormData(prev => ({
                        ...prev,
                        hasChronicDiseases: false,
                      }))
                    }
                    className="mr-1"
                  />
                  Ні
                </label>
              </div>
              {formData.hasChronicDiseases && (
                <input
                  type="text"
                  name="chronicDiseases"
                  value={formData.chronicDiseases}
                  onChange={handleInputChange}
                  placeholder="Перерахуйте хронічні хвороби"
                  className="w-full rounded-md border border-gray-300 p-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                />
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Чи приймає ліки постійно?
              </label>
              <div className="mb-2 flex space-x-4">
                <label className="flex cursor-pointer items-center">
                  <input
                    type="radio"
                    name="takesMedications"
                    checked={formData.takesMedications}
                    onChange={() =>
                      setFormData(prev => ({ ...prev, takesMedications: true }))
                    }
                    className="mr-1"
                  />
                  Так
                </label>
                <label className="flex cursor-pointer items-center">
                  <input
                    type="radio"
                    name="takesMedications"
                    checked={!formData.takesMedications}
                    onChange={() =>
                      setFormData(prev => ({
                        ...prev,
                        takesMedications: false,
                      }))
                    }
                    className="mr-1"
                  />
                  Ні
                </label>
              </div>
              {formData.takesMedications && (
                <input
                  type="text"
                  name="medications"
                  value={formData.medications}
                  onChange={handleInputChange}
                  placeholder="Перерахуйте ліки"
                  className="w-full rounded-md border border-gray-300 p-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                />
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Рівень болю (0-10): {formData.painLevel}
              </label>
              <input
                type="range"
                name="painLevel"
                min="0"
                max="10"
                value={formData.painLevel}
                onChange={handleInputChange}
                className="w-full"
              />
              <div className="mt-1 flex justify-between text-xs text-gray-500">
                <span>Немає болю (0)</span>
                <span>Нестерпний біль (10)</span>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Алергія</label>
              <div className="mb-2 flex space-x-4">
                <label className="flex cursor-pointer items-center">
                  <input
                    type="radio"
                    name="hasAllergy"
                    checked={formData.hasAllergy}
                    onChange={() =>
                      setFormData(prev => ({ ...prev, hasAllergy: true }))
                    }
                    className="mr-1"
                  />
                  Так
                </label>
                <label className="flex cursor-pointer items-center">
                  <input
                    type="radio"
                    name="hasAllergy"
                    checked={!formData.hasAllergy}
                    onChange={() =>
                      setFormData(prev => ({ ...prev, hasAllergy: false }))
                    }
                    className="mr-1"
                  />
                  Ні
                </label>
              </div>
              {formData.hasAllergy && (
                <input
                  type="text"
                  name="allergies"
                  value={formData.allergies}
                  onChange={handleInputChange}
                  placeholder="Перерахуйте алергії"
                  className="w-full rounded-md border border-gray-300 p-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                />
              )}
            </div>
          </div>
        </div>

        {/* Додаткові коментарі */}
        <div className="rounded-lg bg-gray-50 p-4">
          <h2 className="mb-4 flex items-center text-lg font-semibold">
            💬 Додаткові коментарі
          </h2>
          <textarea
            name="additionalNotes"
            value={formData.additionalNotes}
            onChange={handleInputChange}
            placeholder="Додаткові замітки"
            rows={3}
            className="w-full rounded-md border border-gray-300 p-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-md bg-blue-600 px-4 py-3 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? 'Надсилання...' : 'Надіслати консультацію'}
        </button>

        {submitMessage && (
          <div className="rounded-md bg-gray-100 p-4 text-center">
            {submitMessage}
          </div>
        )}
      </form>
    </div>
  )
}
