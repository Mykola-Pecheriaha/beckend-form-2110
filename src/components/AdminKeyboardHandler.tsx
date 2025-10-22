'use client'

import { useState, useEffect } from 'react'
import AdminPanel from './AdminPanel'

const ADMIN_SEQUENCE = ['a', 'd', 'm', 'i', 'n'] // Послідовність "admin"

export default function AdminKeyboardHandler() {
  const [isAdminOpen, setIsAdminOpen] = useState(false)
  const [keySequence, setKeySequence] = useState<string[]>([])

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Ігноруємо натискання в полях вводу
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement ||
        event.target instanceof HTMLSelectElement
      ) {
        return
      }

      const key = event.key.toLowerCase()

      setKeySequence(prev => {
        const newSequence = [...prev, key].slice(-ADMIN_SEQUENCE.length)

        // Перевіряємо чи збігається послідовність
        if (newSequence.length === ADMIN_SEQUENCE.length) {
          const matches = newSequence.every(
            (k, index) => k === ADMIN_SEQUENCE[index]
          )
          if (matches) {
            setIsAdminOpen(true)
            return []
          }
        }

        return newSequence
      })
    }

    window.addEventListener('keydown', handleKeyPress)

    return () => {
      window.removeEventListener('keydown', handleKeyPress)
    }
  }, [])

  const closeAdmin = () => {
    setIsAdminOpen(false)
    setKeySequence([])
  }

  if (!isAdminOpen) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative h-full w-full overflow-auto bg-white">
        <button
          onClick={closeAdmin}
          className="fixed right-4 top-4 z-10 rounded-md bg-red-500 px-4 py-2 text-white hover:bg-red-600"
        >
          Закрити адмін-панель
        </button>
        <AdminPanel />
      </div>
    </div>
  )
}
