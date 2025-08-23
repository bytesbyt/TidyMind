"use client"

import { ChevronLeft, ChevronRight, Check } from "lucide-react"

interface CalendarSidebarProps {
  currentDate: Date
  onDateChange: (date: Date) => void
  selectedCalendars: {
    tasks: boolean
    birthdays: boolean
    reminders: boolean
  }
  onToggleCalendar: (calendar: string) => void
}

export function CalendarSidebar({
  currentDate,
  onDateChange,
  selectedCalendars,
  onToggleCalendar
}: CalendarSidebarProps) {
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const handlePrevMonth = () => {
    onDateChange(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  }

  const handleNextMonth = () => {
    onDateChange(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
  }

  // Mini calendar for sidebar
  const renderMiniCalendar = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const totalDays = getDaysInMonth(currentDate)
    const startDay = getFirstDayOfMonth(currentDate)
    
    const days = []
    
    // Empty cells for alignment
    for (let i = 0; i < startDay; i++) {
      days.push(<div key={`empty-${i}`} />)
    }
    
    // Days of month
    for (let day = 1; day <= totalDays; day++) {
      const isToday = day === 19 && month === 7 && year === 2025 // August 19, 2025
      days.push(
        <div
          key={day}
          className={`text-xs p-1 text-center cursor-pointer rounded ${
            isToday ? 'bg-[var(--tidymind-accent)] text-white' : 'hover:bg-muted'
          }`}
        >
          {day}
        </div>
      )
    }
    
    return days
  }

  return (
    <div className="w-64 border-r border-border p-4 overflow-y-auto scrollbar-hide bg-white dark:bg-card">
      {/* Mini Calendar */}
      <div className="mb-6 mt-13">
        <div className="flex items-center justify-between mb-3">
          <button onClick={handlePrevMonth} className="p-1 hover:bg-muted rounded">
            <ChevronLeft className="h-3 w-3" />
          </button>
          <h3 className="font-semibold text-sm text-center">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h3>
          <button onClick={handleNextMonth} className="p-1 hover:bg-muted rounded">
            <ChevronRight className="h-3 w-3" />
          </button>
        </div>
        
        {/* Mini Calendar Grid */}
        <div className="grid grid-cols-7 gap-1 text-center mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-xs text-muted-foreground">
              {day.slice(0, 1)}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {renderMiniCalendar()}
        </div>
      </div>

      {/* My Calendars */}
      <div className="p-4 bg-gray-50 dark:bg-muted/30 rounded-lg">
        <h3 className="font-semibold text-sm mb-3">My calendars</h3>
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <div className="relative">
              <input
                type="checkbox"
                checked={selectedCalendars.tasks}
                onChange={() => onToggleCalendar('tasks')}
                className="sr-only"
              />
              <div className={`w-4 h-4 rounded border-2 ${selectedCalendars.tasks ? 'bg-[#E8E5FF] border-[#E8E5FF]' : 'border-gray-300'}`}>
                {selectedCalendars.tasks && <Check className="h-3 w-3 text-gray-700" />}
              </div>
            </div>
            <span className="text-sm">Tasks</span>
          </label>
          
          <label className="flex items-center gap-2 cursor-pointer">
            <div className="relative">
              <input
                type="checkbox"
                checked={selectedCalendars.birthdays}
                onChange={() => onToggleCalendar('birthdays')}
                className="sr-only"
              />
              <div className={`w-4 h-4 rounded border-2 ${selectedCalendars.birthdays ? 'bg-[#FFE5F5] border-[#FFE5F5]' : 'border-gray-300'}`}>
                {selectedCalendars.birthdays && <Check className="h-3 w-3 text-gray-700" />}
              </div>
            </div>
            <span className="text-sm">Birthdays</span>
          </label>
          
          <label className="flex items-center gap-2 cursor-pointer">
            <div className="relative">
              <input
                type="checkbox"
                checked={selectedCalendars.reminders}
                onChange={() => onToggleCalendar('reminders')}
                className="sr-only"
              />
              <div className={`w-4 h-4 rounded border-2 ${selectedCalendars.reminders ? 'bg-[#E5FFE5] border-[#E5FFE5]' : 'border-gray-300'}`}>
                {selectedCalendars.reminders && <Check className="h-3 w-3 text-gray-700" />}
              </div>
            </div>
            <span className="text-sm">Reminders</span>
          </label>
        </div>
      </div>

      {/* Tasks Completed Section */}
      <div className="mt-8 p-4 bg-gray-50 dark:bg-muted/30 rounded-lg">
        <h3 className="font-semibold text-sm mb-3">
          12 Tasks completed this month
        </h3>
        <div className="flex gap-2">
          {/* Day labels */}
          <div className="flex flex-col gap-0.5 justify-between pt-0.5">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
              <div key={day} className="text-xs text-muted-foreground h-3 flex items-center">
                {index % 2 === 0 ? day : ''}
              </div>
            ))}
          </div>
          
          {/* Grid of squares */}
          <div className="grid grid-rows-7 grid-flow-col gap-0.5">
            {Array.from({ length: 31 }, (_, i) => {
              // Sample data: different task counts for different days
              const taskCounts = [0, 2, 1, 3, 0, 1, 4, 2, 0, 1, 2, 3, 1, 0, 2, 1, 0, 3, 2, 1, 0, 0, 1, 2, 3, 0, 1, 2, 0, 1, 3]
              const count = taskCounts[i] || 0
              
              // Calculate opacity based on task count (0-4 tasks)
              const opacity = count === 0 ? 0.1 : 0.2 + (count * 0.2)
              
              return (
                <div
                  key={i}
                  className="w-3 h-3 rounded-sm transition-all hover:ring-1 hover:ring-offset-1 hover:ring-gray-400 cursor-pointer"
                  style={{
                    backgroundColor: 'var(--cyan)',
                    opacity: opacity
                  }}
                  title={`Day ${i + 1}: ${count} tasks completed`}
                />
              )
            })}
          </div>
        </div>
        <div className="flex items-center gap-3 mt-3">
          <span className="text-xs text-muted-foreground">Less</span>
          <div className="flex gap-0.5">
            {[0.1, 0.4, 0.6, 0.8, 1].map((opacity, i) => (
              <div
                key={i}
                className="w-3 h-3 rounded-sm"
                style={{
                  backgroundColor: 'var(--cyan)',
                  opacity: opacity
                }}
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground">More</span>
        </div>
      </div>
    </div>
  )
}