"use client"

import { Plus } from "lucide-react"

interface FloatingAddButtonProps {
  onClick: () => void
  title?: string
}

export function FloatingAddButton({ onClick, title = "Add new event" }: FloatingAddButtonProps) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-8 right-8 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center z-40 hover:scale-105"
      style={{ backgroundColor: 'var(--tidymind-orange)' }}
      title={title}
    >
      <Plus className="h-6 w-6 text-white" />
    </button>
  )
}