'use client'

interface CardProps {
  children: React.ReactNode
  className?: string
}

export default function Card({ children, className = '' }: CardProps) {
  return (
    <div className={`rounded-lg bg-white p-6 shadow-md ${className}`}>
      {children}
    </div>
  )
}
