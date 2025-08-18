"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Brain, Trash2, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { TopNavigation } from "@/components/top-navigation"

interface Note {
  id: string
  content: string
  category: string
  timestamp: Date
  color: string
}

const categoryColors = {
  Task: "bg-blue-100 text-blue-800 border-blue-200",
  Idea: "bg-purple-100 text-purple-800 border-purple-200",
  Reminder: "bg-orange-100 text-orange-800 border-orange-200",
  Goal: "bg-green-100 text-green-800 border-green-200",
  Thought: "bg-pink-100 text-pink-800 border-pink-200",
  Question: "bg-yellow-100 text-yellow-800 border-yellow-200",
  Other: "bg-gray-100 text-gray-800 border-gray-200",
}

export default function TidyMindPlanner() {
  const [notes, setNotes] = useState<Note[]>([])
  const [newNote, setNewNote] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  // Load notes from localStorage on mount
  useEffect(() => {
    const savedNotes = localStorage.getItem("tidy-mind-notes")
    if (savedNotes) {
      const parsed = JSON.parse(savedNotes)
      setNotes(
        parsed.map((note: any) => ({
          ...note,
          timestamp: new Date(note.timestamp),
        })),
      )
    }
  }, [])

  // Save notes to localStorage whenever notes change
  useEffect(() => {
    localStorage.setItem("tidy-mind-notes", JSON.stringify(notes))
  }, [notes])

  const addNote = async () => {
    if (!newNote.trim()) return

    setIsLoading(true)

    try {
      // Call AI categorization API
      const response = await fetch("/api/categorize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newNote }),
      })

      const { category } = await response.json()

      const note: Note = {
        id: Date.now().toString(),
        content: newNote,
        category: category || "Other",
        timestamp: new Date(),
        color: categoryColors[category as keyof typeof categoryColors] || categoryColors.Other,
      }

      setNotes((prev) => [note, ...prev])
      setNewNote("")
    } catch (error) {
      console.error("Error categorizing note:", error)
      // Fallback: add note without categorization
      const note: Note = {
        id: Date.now().toString(),
        content: newNote,
        category: "Other",
        timestamp: new Date(),
        color: categoryColors.Other,
      }
      setNotes((prev) => [note, ...prev])
      setNewNote("")
    } finally {
      setIsLoading(false)
    }
  }

  const deleteNote = (id: string) => {
    setNotes((prev) => prev.filter((note) => note.id !== id))
  }

  const filteredNotes = notes.filter((note) => {
    const matchesSearch =
      note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || note.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const categories = ["all", ...Object.keys(categoryColors)]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <TopNavigation searchTerm={searchTerm} onSearchChange={setSearchTerm} />

      <div className="pt-40 p-4">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2">
              <Brain className="h-10 w-10 text-indigo-600" />
              <h1 className="text-4xl font-bold text-gray-900 font-sans">TidyMind</h1>
            </div>
            <p className="text-lg text-gray-600 font-sans">Capture your thoughts and let AI organize them for you</p>
          </div>

          {/* Add Note Section */}
          <Card className="border-2 border-indigo-200 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl font-sans">
                <Plus className="h-7 w-7" />
                Quick Thought Capture
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="What's on your mind? Just dump it here - I'll help organize it!"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                className="min-h-[100px] text-xl font-sans"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && e.ctrlKey) {
                    addNote()
                  }
                }}
              />
              <Button
                onClick={addNote}
                disabled={!newNote.trim() || isLoading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-lg font-sans"
              >
                {isLoading ? (
                  <>
                    <Sparkles className="h-5 w-5 mr-2 animate-spin" />
                    AI is categorizing...
                  </>
                ) : (
                  <>
                    <Plus className="h-5 w-5 mr-2" />
                    Add & Categorize (Ctrl+Enter)
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Filter Categories */}
          <div className="flex justify-center">
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={cn("capitalize", selectedCategory === category && "bg-indigo-600 hover:bg-indigo-700")}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {/* Notes Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredNotes.map((note) => (
              <Card key={note.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <Badge className={note.color}>{note.category}</Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteNote(note.id)}
                      className="h-8 w-8 p-0 text-gray-400 hover:text-red-500"
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-base text-gray-700 leading-relaxed font-sans">{note.content}</p>
                  <p className="text-sm text-gray-500 font-sans">
                    {note.timestamp.toLocaleDateString()} at{" "}
                    {note.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredNotes.length === 0 && (
            <div className="text-center py-12">
              <Brain className="h-18 w-18 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-500 mb-2 font-sans">
                {searchTerm || selectedCategory !== "all" ? "No matching thoughts found" : "Your mind is clear"}
              </h3>
              <p className="text-base text-gray-400 font-sans">
                {searchTerm || selectedCategory !== "all"
                  ? "Try adjusting your search or filter"
                  : "Start by adding your first thought above!"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
