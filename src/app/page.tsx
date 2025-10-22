'use client'

import ConsultationForm from '@/components/ConsultationForm'
import AdminKeyboardHandler from '@/components/AdminKeyboardHandler'

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold text-gray-800">
            Медична консультація
          </h1>
          <p className="text-gray-600">
            Заповніть форму для отримання медичної консультації
          </p>
        </div>

        <ConsultationForm />

        {/* Компонент для обробки клавіатури */}
        <AdminKeyboardHandler />
      </div>
    </main>
  )
}
