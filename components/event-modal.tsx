"use client"

import { useState, useEffect } from "react"
import { X, Calendar, Clock, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

interface EventModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (event: EventData) => void
  selectedDate?: Date
}

export interface EventData {
  title: string
  description?: string
  date: string
  time?: string
  category: 'task' | 'reminder' | 'event'
}

const categoryOptions = [
  { value: 'task', label: 'Task', icon: '✓' },
  { value: 'reminder', label: 'Reminder', icon: '🔔' },
  { value: 'event', label: 'Event', icon: '📅' }
] as const

export function EventModal({ isOpen, onClose, onSave, selectedDate }: EventModalProps) {
  const [formData, setFormData] = useState<EventData>({
    title: '',
    description: '',
    date: selectedDate ? selectedDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    time: '',
    category: 'task'
  })

  const [errors, setErrors] = useState<{ title?: string; date?: string }>({})

  useEffect(() => {
    if (selectedDate) {
      setFormData(prev => ({
        ...prev,
        date: selectedDate.toISOString().split('T')[0]
      }))
    }
  }, [selectedDate])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation
    const newErrors: { title?: string; date?: string } = {}
    if (!formData.title.trim()) {
      newErrors.title = 'Please enter a title'
    }
    if (!formData.date) {
      newErrors.date = 'Please select a date'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    onSave(formData)
    handleClose()
  }

  const handleClose = () => {
    setFormData({
      title: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      time: '',
      category: 'task'
    })
    setErrors({})
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative bg-card rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-playfair-semibold">Create New Event</h2>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 rounded-full"
            onClick={handleClose}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto max-h-[calc(90vh-180px)]">
          {/* Title */}
          <div>
            <label className="text-sm font-medium mb-2 block">
              Title <span className="text-destructive">*</span>
            </label>
            <Input
              type="text"
              placeholder="Enter event title"
              value={formData.title}
              onChange={(e) => {
                setFormData(prev => ({ ...prev, title: e.target.value }))
                if (errors.title) setErrors(prev => ({ ...prev, title: undefined }))
              }}
              className={cn(
                "h-11",
                errors.title && "border-destructive focus:ring-destructive"
              )}
            />
            {errors.title && (
              <p className="text-xs text-destructive mt-1">{errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium mb-2 block">Description</label>
            <Textarea
              placeholder="Enter event description (optional)"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="min-h-[80px] resize-none"
            />
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Date <span className="text-destructive">*</span>
              </label>
              <Input
                type="date"
                value={formData.date}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, date: e.target.value }))
                  if (errors.date) setErrors(prev => ({ ...prev, date: undefined }))
                }}
                className={cn(
                  "h-11",
                  errors.date && "border-destructive focus:ring-destructive"
                )}
              />
              {errors.date && (
                <p className="text-xs text-destructive mt-1">{errors.date}</p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium mb-2 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Time
              </label>
              <Input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                className="h-11"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="text-sm font-medium mb-2 flex items-center gap-2">
              <Tag className="h-4 w-4" />
              Category
            </label>
            <div className="grid grid-cols-3 gap-2">
              {categoryOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, category: option.value }))}
                  className={cn(
                    "flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all",
                    formData.category === option.value
                      ? "border-[var(--tidymind-orange)] bg-orange-50 dark:bg-orange-950/20"
                      : "border-border hover:border-border/80"
                  )}
                >
                  <span className="text-lg mb-1">{option.icon}</span>
                  <span className="text-xs">{option.label}</span>
                </button>
              ))}
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-border bg-muted/30">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            style={{ backgroundColor: 'var(--tidymind-orange)' }}
            className="text-white hover:opacity-90"
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  )
}