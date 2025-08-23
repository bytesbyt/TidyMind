"use client"

import { useEffect, useState } from "react"
import dynamic from 'next/dynamic'
import { Search } from "lucide-react"

// Dynamic import of FullCalendar to avoid SSR issues
const FullCalendar = dynamic(() => import('@fullcalendar/react'), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-full">Loading calendar...</div>
})

interface Task {
  id: number
  title: string
  time?: string
  color: string
}

interface TasksData {
  [key: string]: Task[]
}

interface MainCalendarProps {
  currentDate: Date
  onDateChange: (date: Date) => void
  tasks: TasksData
  onDayClick: (date: Date) => void
}

export function MainCalendar({
  currentDate,
  onDateChange,
  tasks,
  onDayClick
}: MainCalendarProps) {
  // Import plugins dynamically
  const [plugins, setPlugins] = useState<any[]>([])
  
  useEffect(() => {
    Promise.all([
      import('@fullcalendar/daygrid'),
      import('@fullcalendar/interaction')
    ]).then(([dayGridPlugin, interactionPlugin]) => {
      setPlugins([dayGridPlugin.default, interactionPlugin.default])
    })
  }, [])

  // Convert tasks to FullCalendar events format
  const events = Object.entries(tasks).flatMap(([date, dayTasks]) => 
    dayTasks.map(task => ({
      id: task.id.toString(),
      title: task.title,
      date: date,
      backgroundColor: task.color,
      borderColor: task.color,
      textColor: '#333',
      classNames: ['tidymind-event']
    }))
  )

  const handleDateClick = (info: any) => {
    onDayClick(new Date(info.date))
  }

  const handleDatesSet = (dateInfo: any) => {
    // Update the currentDate when user navigates
    const newDate = new Date(dateInfo.view.currentStart)
    // Set to the 1st of the month
    newDate.setDate(1)
    onDateChange(newDate)
  }

  // Don't render until plugins are loaded
  if (plugins.length === 0) {
    return (
      <div className="flex-1 flex flex-col bg-white dark:bg-card min-h-full">
        <div className="flex items-center justify-center h-full">
          <span className="text-muted-foreground">Loading calendar...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col bg-white dark:bg-card min-h-full">
      {/* Calendar Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-white dark:bg-card">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-playfair-regular">Calendar</h2>
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

      {/* FullCalendar Component */}
      <div className="flex-1 p-6 fullcalendar-container">
        <FullCalendar
          plugins={plugins}
          initialView="dayGridMonth"
          initialDate={currentDate}
          events={events}
          dateClick={handleDateClick}
          datesSet={handleDatesSet}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: ''
          }}
          height="100%"
          dayMaxEvents={3}
          eventDisplay="block"
          eventTimeFormat={{
            hour: 'numeric',
            minute: '2-digit',
            meridiem: 'short'
          }}
          dayCellClassNames="tidymind-day-cell"
          eventClassNames="tidymind-event"
          nowIndicator={true}
          fixedWeekCount={false}
          contentHeight="auto"
          aspectRatio={1.8}
        />
      </div>
    </div>
  )
}