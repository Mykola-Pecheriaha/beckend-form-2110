import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Медична консультація',
  description: 'Форма для отримання медичної консультації онлайн',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
