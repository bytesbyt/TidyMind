"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { TopNavigation } from "@/components/top-navigation"
import { LeftNavigation } from "@/components/left-navigation"
import { Hero } from "@/components/hero"
import { Footer } from "@/components/footer"

export default function HomePage() {
  const [newNote, setNewNote] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleAddNote = async () => {
    if (!newNote.trim()) return

    setIsLoading(true)

    try {
      // Save the note to localStorage temporarily
      const tempNote = {
        content: newNote,
        timestamp: new Date().toISOString(),
        pending: true
      }
      
      // Get existing pending notes or create new array
      const existingPending = localStorage.getItem("tidy-mind-pending-notes")
      const pendingNotes = existingPending ? JSON.parse(existingPending) : []
      pendingNotes.push(tempNote)
      localStorage.setItem("tidy-mind-pending-notes", JSON.stringify(pendingNotes))
      
      // Navigate to collections page
      router.push("/collections")
    } catch (error) {
      console.error("Error saving note:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <LeftNavigation />
      <TopNavigation searchTerm={searchTerm} onSearchChange={setSearchTerm} />

      <div className="md:pl-20">
        {/* Hero Section - Full height */}
        <div className="h-[100dvh] flex items-center justify-center px-4 max-w-7xl mx-auto">
          <div className="max-w-2xl lg:max-w-3xl w-full">
            <div className="text-center mb-10">
              <p className="text-xs md:text-sm font-semibold tracking-[0.2em] mb-8 text-[var(--tidymind-orange)] dark:text-cyan-400">
                TIDYMIND WORKS
              </p>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-playfair-bold leading-[1.2] mb-8">
                Drop your thoughts.
              </h1>
              <p className="text-base md:text-lg text-muted-foreground/70 max-w-lg mx-auto leading-relaxed">
                Every random note, every fleeting idea, TidyMind captures it all. 
                Instantly organized with tasks added to your calendar.
              </p>
            </div>
            <Hero 
              newNote={newNote}
              setNewNote={setNewNote}
              onAddNote={handleAddNote}
              isLoading={isLoading}
            />
          </div>
        </div>

        {/* Footer at the bottom */}
        <Footer />
      </div>
    </div>
  )
}