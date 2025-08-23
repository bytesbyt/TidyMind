"use client"

import { useState } from "react"
import { LeftNavigation } from "@/components/left-navigation"
import { TopNavigation } from "@/components/top-navigation"
import { EventModal, type EventData } from "@/components/event-modal"
import { CalendarSidebar } from "@/components/calendar-sidebar"
import { MainCalendar } from "@/components/main-calendar"
import { FloatingAddButton } from "@/components/floating-add-button"

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
  const [selectedCalendars, setSelectedCalendars] = useState({
    tasks: true,
    birthdays: true,
    reminders: true
  })
  const [isEventModalOpen, setIsEventModalOpen] = useState(false)
  const [selectedDateForEvent, setSelectedDateForEvent] = useState<Date | undefined>()

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

  const toggleCalendar = (calendar: string) => {
    setSelectedCalendars(prev => ({
      ...prev,
      [calendar]: !prev[calendar as keyof typeof prev]
    }))
  }

  const handleSaveEvent = (eventData: EventData) => {
    console.log('New event created:', eventData)
    // TODO: Save to database/state management
    // For now, just log the event data
    // In production, this would make an API call to save the event
  }

  const handleDayClick = (date: Date) => {
    setSelectedDateForEvent(date)
    setIsEventModalOpen(true)
  }

  return (
    <div className="min-h-screen bg-background">
      <LeftNavigation />
      <TopNavigation transparentBg={false} whiteBg={true} />

      <div className="md:pl-20 pt-24">
        <div className="flex h-[calc(100vh-6rem)]">
          {/* Calendar Sidebar Component */}
          <CalendarSidebar
            currentDate={currentDate}
            onDateChange={setCurrentDate}
            selectedCalendars={selectedCalendars}
            onToggleCalendar={toggleCalendar}
          />

          {/* Main Calendar Component */}
          <MainCalendar
            currentDate={currentDate}
            onDateChange={setCurrentDate}
            tasks={tasks}
            onDayClick={handleDayClick}
          />
        </div>
      </div>
      
      {/* Floating Add Event Button */}
      <FloatingAddButton
        onClick={() => {
          setSelectedDateForEvent(undefined) // No specific date selected
          setIsEventModalOpen(true)
        }}
      />

      {/* Event Creation Modal */}
      <EventModal
        isOpen={isEventModalOpen}
        onClose={() => setIsEventModalOpen(false)}
        onSave={handleSaveEvent}
        selectedDate={selectedDateForEvent}
      />
    </div>
  )
}