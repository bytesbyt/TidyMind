"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Search, Check } from "lucide-react"
import { LeftNavigation } from "@/components/left-navigation"
import { TopNavigation } from "@/components/top-navigation"

interface Task {
  id: number
  title: string
  time?: string
  color: string
}

interface TasksData {
  [key: string]: Task[]
}

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 7, 1)) // August 2025
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCalendars, setSelectedCalendars] = useState({
    tasks: true,
    birthdays: true,
    reminders: true
  })

  // Sample tasks data for August 2025
  const tasks: TasksData = {
    "2025-08-07": [
      { id: 1, title: "Team Meeting", time: "9:00 AM", color: "#E8E5FF" }
    ],
    "2025-08-08": [
      { id: 2, title: "Project Review", time: "2:00 PM", color: "#FFE5F5" }
    ],
    "2025-08-12": [
      { id: 3, title: "Client Call", time: "10:30 AM", color: "#E5F5FF" }
    ],
    "2025-08-14": [
      { id: 4, title: "Design Review", time: "3:00 PM", color: "#E8E5FF" },
      { id: 5, title: "Lunch Meeting", time: "12:00 PM", color: "#E5FFE5" }
    ],
    "2025-08-19": [
      { id: 6, title: "Sprint Planning", time: "10:00 AM", color: "#E8E5FF" },
      { id: 7, title: "Doctor Appointment", time: "4:00 PM", color: "#FFE5F5" }
    ],
    "2025-08-22": [
      { id: 8, title: "Workshop", time: "9:00 AM", color: "#E5FFE5" }
    ],
    "2025-08-26": [
      { id: 9, title: "Quarterly Review", time: "2:00 PM", color: "#E8E5FF" }
    ]
  }

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

  const formatDateKey = (year: number, month: number, day: number) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  }

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
  }


  const toggleCalendar = (calendar: string) => {
    setSelectedCalendars(prev => ({
      ...prev,
      [calendar]: !prev[calendar as keyof typeof prev]
    }))
  }

  const renderCalendarGrid = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const totalDays = getDaysInMonth(currentDate)
    const startDay = getFirstDayOfMonth(currentDate)
    const prevMonthDays = getDaysInMonth(new Date(year, month - 1))
    
    const weeks = []
    let days = []
    
    // Previous month's trailing days
    for (let i = startDay - 1; i >= 0; i--) {
      const day = prevMonthDays - i
      days.push(
        <div key={`prev-${day}`} className="h-28 p-2 border-r border-b border-border bg-white dark:bg-card">
          <span className="text-sm text-muted-foreground">{day}</span>
        </div>
      )
    }
    
    // Current month's days
    for (let day = 1; day <= totalDays; day++) {
      const dateKey = formatDateKey(year, month, day)
      const dayTasks = tasks[dateKey] || []
      const isToday = day === 19 && month === 7 && year === 2025 // August 19, 2025
      
      days.push(
        <div
          key={day}
          className="h-28 p-2 border-r border-b border-border relative bg-white dark:bg-card"
        >
          <div className="flex justify-between items-start">
            <span className={`text-sm ${isToday ? 'bg-[var(--tidymind-accent)] text-white rounded-sm w-7 h-7 flex items-center justify-center' : ''}`}>
              {day}
            </span>
          </div>
          <div className="mt-1 space-y-1">
            {dayTasks.map(task => (
              <div
                key={task.id}
                className="text-xs px-2 py-1 rounded truncate cursor-pointer hover:opacity-80"
                style={{ backgroundColor: task.color }}
              >
                {task.title}
              </div>
            ))}
          </div>
        </div>
      )
      
      // Start new week
      if ((startDay + day) % 7 === 0 || day === totalDays) {
        // Fill remaining cells if last week
        if (day === totalDays && days.length < 7) {
          let nextDay = 1
          while (days.length < 7) {
            days.push(
              <div key={`next-${nextDay}`} className="h-28 p-2 border-r border-b border-border bg-white dark:bg-card">
                <span className="text-sm text-muted-foreground">{nextDay}</span>
              </div>
            )
            nextDay++
          }
        }
        weeks.push(
          <div key={`week-${weeks.length}`} className="grid grid-cols-7">
            {days}
          </div>
        )
        days = []
      }
    }
    
    return weeks
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
    <div className="min-h-screen bg-background">
      <LeftNavigation />
      <TopNavigation searchTerm={searchTerm} onSearchChange={setSearchTerm} transparentBg={false} whiteBg={true} />

      <div className="md:pl-20 pt-24">
        <div className="flex h-[calc(100vh-6rem)]">
          {/* Left Sidebar */}
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
                      onChange={() => toggleCalendar('tasks')}
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
                      onChange={() => toggleCalendar('birthdays')}
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
                      onChange={() => toggleCalendar('reminders')}
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

          {/* Main Calendar Area */}
          <div className="flex-1 flex flex-col bg-white dark:bg-card min-h-full">
            {/* Calendar Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-white dark:bg-card">
              <div className="flex items-center gap-4">
                <h2 className="text-2xl font-playfair-regular">
                  {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h2>
                <div className="flex gap-1">
                  <button onClick={handlePrevMonth} className="p-1 hover:bg-muted rounded">
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button onClick={handleNextMonth} className="p-1 hover:bg-muted rounded">
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Find Events"
                    className="pl-10 pr-4 h-9 border border-border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="flex-1 flex flex-col overflow-auto scrollbar-hide bg-white dark:bg-card">
              {/* Day Headers */}
              <div className="grid grid-cols-7 bg-gray-50 dark:bg-muted/30 sticky top-0 z-10">
                {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(day => (
                  <div key={day} className="px-2 py-2 text-xs font-medium text-muted-foreground text-center border-r border-b border-border">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Weeks */}
              <div className="bg-white dark:bg-card flex-1 min-h-full">
                {renderCalendarGrid()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}