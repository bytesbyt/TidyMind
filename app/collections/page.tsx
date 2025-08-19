"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trash2, Calendar, Clock, Edit2, Save, X, Plus, Settings } from "lucide-react"
import { cn } from "@/lib/utils"
import { TopNavigation } from "@/components/top-navigation"
import { LeftNavigation } from "@/components/left-navigation"
import { Footer } from "@/components/footer"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"

interface Note {
  id: string
  content: string
  category: string
  timestamp: Date
  color: string
  title?: string
}

const defaultCategoryColors = {
  Task: "border-blue-500 text-blue-500",
  Idea: "border-purple-500 text-purple-500",
  Reminder: "border-orange-500 text-orange-500",
  Goal: "border-green-500 text-green-500",
  Thought: "border-pink-500 text-pink-500",
  Question: "border-yellow-500 text-yellow-500",
  Articles: "border-red-400 text-red-400",
  Notes: "border-rose-400 text-rose-400",
  Images: "border-amber-400 text-amber-400",
  Bookmarks: "border-fuchsia-400 text-fuchsia-400",
  Inspiration: "border-cyan-400 text-cyan-400",
  Other: "border-gray-400 text-gray-400",
}

export default function CollectionsPage() {
  const [notes, setNotes] = useState<Note[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedNote, setSelectedNote] = useState<Note | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [isEditing, setIsEditing] = useState(false)
  const [editedContent, setEditedContent] = useState("")
  const [categoryColors, setCategoryColors] = useState(defaultCategoryColors)
  const [showCategoryManager, setShowCategoryManager] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState("")

  // Load notes and categories from localStorage on mount
  useEffect(() => {
    // Load saved categories
    const savedCategories = localStorage.getItem("tidy-mind-categories")
    if (savedCategories) {
      setCategoryColors(JSON.parse(savedCategories))
    }

    const loadNotes = async () => {
      // First, load existing saved notes
      const savedNotes = localStorage.getItem("tidy-mind-notes")
      let existingNotes: Note[] = []
      
      if (savedNotes) {
        const parsed = JSON.parse(savedNotes)
        existingNotes = parsed.map((note: any) => ({
          ...note,
          timestamp: new Date(note.timestamp),
          title: note.title || note.content.split('\n')[0].substring(0, 50) + (note.content.length > 50 ? '...' : '')
        }))
      }

      // Then check for pending notes from home page
      const pendingNotes = localStorage.getItem("tidy-mind-pending-notes")
      if (pendingNotes) {
        const pending = JSON.parse(pendingNotes)
        
        // Process all pending notes
        const newNotes = await Promise.all(pending.map(async (pendingNote: any) => {
          try {
            const response = await fetch("/api/categorize", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ content: pendingNote.content }),
            })
            const { category } = await response.json()
            
            return {
              id: Date.now().toString() + Math.random(),
              content: pendingNote.content,
              category: category || "Other",
              timestamp: new Date(pendingNote.timestamp),
              color: categoryColors[category as keyof typeof categoryColors] || categoryColors.Other,
              title: pendingNote.content.split('\n')[0].substring(0, 50) + (pendingNote.content.length > 50 ? '...' : '')
            }
          } catch (error) {
            // Fallback without categorization
            return {
              id: Date.now().toString() + Math.random(),
              content: pendingNote.content,
              category: "Other",
              timestamp: new Date(pendingNote.timestamp),
              color: categoryColors.Other,
              title: pendingNote.content.split('\n')[0].substring(0, 50) + (pendingNote.content.length > 50 ? '...' : '')
            }
          }
        }))
        
        // Combine existing and new notes
        existingNotes = [...newNotes, ...existingNotes]
        
        // Clear pending notes after processing
        localStorage.removeItem("tidy-mind-pending-notes")
      }
      
      // Set all notes at once
      setNotes(existingNotes)
      
      // Select the first note by default
      if (existingNotes.length > 0) {
        setSelectedNote(existingNotes[0])
      }
      
      // Save the combined notes immediately
      if (existingNotes.length > 0) {
        localStorage.setItem("tidy-mind-notes", JSON.stringify(existingNotes))
      }
    }
    
    loadNotes()
  }, [])

  // Save notes to localStorage whenever notes change (but skip initial empty state)
  useEffect(() => {
    if (notes.length > 0) {
      localStorage.setItem("tidy-mind-notes", JSON.stringify(notes))
    }
  }, [notes])

  const deleteNote = (id: string) => {
    setNotes((prev) => {
      const filtered = prev.filter((note) => note.id !== id)
      // If we deleted the selected note, select another one
      if (selectedNote?.id === id) {
        setSelectedNote(filtered.length > 0 ? filtered[0] : null)
      }
      return filtered
    })
  }

  const startEditing = () => {
    if (selectedNote) {
      setEditedContent(selectedNote.content)
      setIsEditing(true)
    }
  }

  const saveEdit = () => {
    if (selectedNote && editedContent.trim()) {
      const updatedNotes = notes.map(note => 
        note.id === selectedNote.id 
          ? { 
              ...note, 
              content: editedContent,
              title: editedContent.split('\n')[0].substring(0, 50) + (editedContent.length > 50 ? '...' : '')
            }
          : note
      )
      setNotes(updatedNotes)
      setSelectedNote({
        ...selectedNote,
        content: editedContent,
        title: editedContent.split('\n')[0].substring(0, 50) + (editedContent.length > 50 ? '...' : '')
      })
      setIsEditing(false)
    }
  }

  const cancelEdit = () => {
    setIsEditing(false)
    setEditedContent("")
  }

  const addCategory = () => {
    if (newCategoryName.trim() && !categoryColors[newCategoryName as keyof typeof categoryColors]) {
      const colors = [
        "border-indigo-500 text-indigo-500",
        "border-teal-500 text-teal-500",
        "border-emerald-500 text-emerald-500",
        "border-sky-500 text-sky-500",
        "border-violet-500 text-violet-500",
        "border-lime-500 text-lime-500",
      ]
      const randomColor = colors[Object.keys(categoryColors).length % colors.length]
      
      const updatedCategories = {
        ...categoryColors,
        [newCategoryName]: randomColor
      }
      
      setCategoryColors(updatedCategories)
      localStorage.setItem("tidy-mind-categories", JSON.stringify(updatedCategories))
      setNewCategoryName("")
    }
  }

  const deleteCategory = (category: string) => {
    if (category !== "Other") { // Prevent deleting "Other" category
      const updatedCategories = { ...categoryColors }
      delete updatedCategories[category as keyof typeof updatedCategories]
      setCategoryColors(updatedCategories)
      localStorage.setItem("tidy-mind-categories", JSON.stringify(updatedCategories))
      
      // Update notes with this category to "Other"
      const updatedNotes = notes.map(note => 
        note.category === category 
          ? { ...note, category: "Other", color: categoryColors.Other }
          : note
      )
      setNotes(updatedNotes)
    }
  }

  const filteredNotes = notes.filter((note) => {
    const matchesSearch =
      note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || note.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  // Group notes by date
  const groupNotesByDate = (notes: Note[]) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    const weekAgo = new Date(today)
    weekAgo.setDate(weekAgo.getDate() - 7)

    const groups: { [key: string]: Note[] } = {
      'Today': [],
      'Yesterday': [],
      'Previous 7 Days': [],
      'Older': []
    }

    notes.forEach(note => {
      const noteDate = new Date(note.timestamp)
      noteDate.setHours(0, 0, 0, 0)

      if (noteDate.getTime() === today.getTime()) {
        groups['Today'].push(note)
      } else if (noteDate.getTime() === yesterday.getTime()) {
        groups['Yesterday'].push(note)
      } else if (noteDate.getTime() > weekAgo.getTime()) {
        groups['Previous 7 Days'].push(note)
      } else {
        groups['Older'].push(note)
      }
    })

    return groups
  }

  const groupedNotes = groupNotesByDate(filteredNotes)

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <LeftNavigation />
      <TopNavigation searchTerm={searchTerm} onSearchChange={setSearchTerm} />

      <div className="md:pl-20 flex-1 flex flex-col">
        <div className="pt-20 md:pt-24 flex-1 flex max-w-6xl mx-auto w-full px-4">
          {/* Left Panel - Memo Details */}
          <div className="flex-1 bg-background">
            {selectedNote ? (
              <div className="h-full flex flex-col">
                <div className="border-b border-border p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h1 className="text-2xl font-semibold mb-2 font-serif">
                        {selectedNote.title || "Untitled Memo"}
                      </h1>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {selectedNote.timestamp.toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {selectedNote.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${selectedNote.color}`}>
                          {selectedNote.category.toLowerCase()}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {isEditing ? (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={saveEdit}
                            className="text-green-600 hover:text-green-700"
                          >
                            <Save className="h-5 w-5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={cancelEdit}
                            className="text-muted-foreground hover:text-foreground"
                          >
                            <X className="h-5 w-5" />
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={startEditing}
                            className="text-muted-foreground hover:text-foreground"
                          >
                            <Edit2 className="h-5 w-5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteNote(selectedNote.id)}
                            className="text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="h-5 w-5" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex-1 p-6 overflow-y-auto">
                  <div className="max-w-4xl">
                    {isEditing ? (
                      <Textarea
                        value={editedContent}
                        onChange={(e) => setEditedContent(e.target.value)}
                        className="min-h-[400px] text-lg font-noto-sans leading-relaxed resize-none border-0 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-0"
                        placeholder="Edit your memo..."
                        autoFocus
                      />
                    ) : (
                      <p className="whitespace-pre-wrap text-foreground font-noto-sans leading-relaxed text-lg">
                        {selectedNote.content}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          {/* Right Panel - Memo List */}
          <div className="w-80 border-l border-border bg-background overflow-y-auto">
            <div className="p-4 border-b border-border bg-background sticky top-0 z-10">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-serif">Collection</h2>
                <button
                  onClick={() => setShowCategoryManager(!showCategoryManager)}
                  className="p-1 hover:bg-muted rounded transition-colors"
                  title="Manage categories"
                >
                  <Settings className="h-4 w-4 text-muted-foreground" />
                </button>
              </div>
              
              {/* Category Manager */}
              {showCategoryManager && (
                <div className="mb-3 p-3 bg-muted/30 rounded-lg">
                  <div className="flex gap-2 mb-2">
                    <Input
                      type="text"
                      placeholder="New category name"
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      className="h-8 text-sm"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          addCategory()
                        }
                      }}
                    />
                    <Button
                      onClick={addCategory}
                      size="sm"
                      className="h-8 px-3"
                      disabled={!newCategoryName.trim()}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground mb-1">Click × to delete a category</p>
                    <div className="flex flex-wrap gap-1">
                      {Object.keys(categoryColors).map((category) => {
                        if (category === "Other") return null // Don't allow deleting "Other"
                        const colorClass = categoryColors[category as keyof typeof categoryColors]
                        return (
                          <div
                            key={category}
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border ${colorClass}`}
                          >
                            <span>{category.toLowerCase()}</span>
                            <button
                              onClick={() => deleteCategory(category)}
                              className="hover:opacity-70 transition-opacity"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              )}
              
              {/* Category filters */}
              <div className="flex flex-wrap gap-1">
                {['all', ...Object.keys(categoryColors)].map((category) => {
                  const colorClass = category === "all" 
                    ? "border-gray-400 text-gray-600" 
                    : categoryColors[category as keyof typeof categoryColors] || "border-gray-400 text-gray-400"
                  
                  return (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={cn(
                        "px-2 py-0.5 rounded-full text-xs border transition-all",
                        selectedCategory === category 
                          ? `${colorClass} bg-opacity-20` 
                          : `${colorClass} bg-transparent hover:bg-gray-50`
                      )}
                      style={{
                        backgroundColor: selectedCategory === category 
                          ? `${colorClass.includes('blue') ? 'rgba(59, 130, 246, 0.1)' :
                              colorClass.includes('purple') ? 'rgba(168, 85, 247, 0.1)' :
                              colorClass.includes('orange') ? 'rgba(249, 115, 22, 0.1)' :
                              colorClass.includes('green') ? 'rgba(34, 197, 94, 0.1)' :
                              colorClass.includes('pink') ? 'rgba(236, 72, 153, 0.1)' :
                              colorClass.includes('yellow') ? 'rgba(234, 179, 8, 0.1)' :
                              colorClass.includes('red') ? 'rgba(248, 113, 113, 0.1)' :
                              colorClass.includes('rose') ? 'rgba(251, 113, 133, 0.1)' :
                              colorClass.includes('amber') ? 'rgba(251, 191, 36, 0.1)' :
                              colorClass.includes('fuchsia') ? 'rgba(217, 70, 239, 0.1)' :
                              colorClass.includes('cyan') ? 'rgba(34, 211, 238, 0.1)' :
                              'rgba(156, 163, 175, 0.1)'}`
                          : 'transparent'
                      }}
                    >
                      {category === "all" ? "all" : category.toLowerCase()}
                    </button>
                  )
                })}
              </div>
            </div>
            
            <div className="p-2">
              {Object.entries(groupedNotes).map(([dateGroup, notes]) => {
                if (notes.length === 0) return null
                
                return (
                  <div key={dateGroup} className="mb-6">
                    <h3 className="text-xs font-medium text-muted-foreground px-2 mb-2">{dateGroup}</h3>
                    <div className="space-y-1">
                      {notes.map(note => (
                        <div
                          key={note.id}
                          onClick={() => setSelectedNote(note)}
                          className={cn(
                            "p-3 rounded-lg cursor-pointer transition-all bg-white dark:bg-card hover:bg-gray-50 dark:hover:bg-muted/50",
                            selectedNote?.id === note.id ? "shadow-sm border border-border" : ""
                          )}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">
                                {note.title || "Untitled"}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                {note.content}
                              </p>
                              <div className="flex items-center gap-2 mt-2">
                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${note.color}`}>
                                  {note.category.toLowerCase()}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {note.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
              
              {filteredNotes.length === 0 && searchTerm && (
                <div className="text-center py-12">
                  <p className="text-sm text-muted-foreground">
                    No memos found
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer at the bottom */}
        <Footer />
      </div>
    </div>
  )
}