"use client"

import { useRef, useState } from "react"
import { Plus, Image, Square, Circle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ImageAttachment, type ImageAttachmentRef } from "./image-attachment"
import { VoiceRecording, type VoiceRecordingRef } from "./voice-recording"

interface HeroProps {
  newNote: string
  setNewNote: (note: string) => void
  onAddNote: () => void
  isLoading: boolean
}

export function Hero({ newNote, setNewNote, onAddNote, isLoading }: HeroProps) {
  const [attachedImages, setAttachedImages] = useState<string[]>([])
  const [isVoiceRecording, setIsVoiceRecording] = useState(false)
  const imageAttachmentRef = useRef<ImageAttachmentRef>(null)
  const voiceRecordingRef = useRef<VoiceRecordingRef>(null)
  
  const handleVoiceTranscript = (transcript: string) => {
    // Append transcript to existing note or replace if empty
    setNewNote(newNote ? `${newNote} ${transcript}` : transcript)
  }
  return (
    <div className="space-y-3">
      {/* Image Attachment Component */}
      <ImageAttachment 
        ref={imageAttachmentRef}
        maxImages={5}
        onImagesChange={setAttachedImages}
      />
      
      <div className="relative">
        {/* Recording indicator overlay */}
        {isVoiceRecording && (
          <div className="absolute inset-0 pointer-events-none z-20">
            <div className="absolute top-3 left-5 right-5 flex items-center gap-2">
              <Circle className="h-3 w-3 animate-pulse" style={{ color: 'var(--tidymind-orange)', fill: 'var(--tidymind-orange)' }} />
              <span className="text-xs font-medium" style={{ color: 'var(--tidymind-orange)' }}>Recording...</span>
              <div className="flex-1 flex items-center justify-center gap-0.5">
                {[...Array(20)].map((_, i) => (
                  <div
                    key={i}
                    className="w-[2px] rounded-full voice-wave-dot"
                    style={{
                      backgroundColor: 'var(--tidymind-orange)',
                      opacity: 0.3,
                      animationDelay: `${i * 0.05}s`,
                      height: '2px'
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Icons - left side */}
        <div className="absolute bottom-2 left-2 md:bottom-2 md:left-4 flex gap-1 md:gap-1 z-10">
          <VoiceRecording
            ref={voiceRecordingRef}
            onTranscript={handleVoiceTranscript}
            onRecordingStateChange={setIsVoiceRecording}
          />
          {!isVoiceRecording && (
            <Button
              variant="ghost"
              className="h-10 w-10 p-0 rounded-full"
              onClick={() => imageAttachmentRef.current?.triggerFileSelect()}
              disabled={attachedImages.length >= 5}
              title={attachedImages.length >= 5 ? "Maximum 5 images allowed" : "Add image"}
            >
              <Image 
                className={attachedImages.length >= 5 ? "text-muted-foreground/40" : "text-muted-foreground"} 
                style={{ width: '20px', height: '20px' }} 
                strokeWidth={1.5} 
              />
            </Button>
          )}
        </div>
        
        <Textarea
          placeholder={isVoiceRecording ? "" : "여기에 무엇이든 입력하세요... 정리는 맡겨주세요!"}
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          className={`min-h-[130px] text-lg md:text-l font-noto-sans focus:outline-none focus:ring-0 focus:border-transparent border-transparent backdrop-blur-sm rounded-[2rem] px-5 md:px-6 py-3 md:py-4 pr-24 md:pr-32 focus-visible:ring-0 focus-visible:ring-offset-0 resize-none transition-all ${
            isVoiceRecording 
              ? 'bg-orange-50/20 dark:bg-orange-900/10 border-orange-200 dark:border-orange-800 pt-12' 
              : 'bg-card/50'
          }`}
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.ctrlKey) {
              onAddNote()
            }
          }}
          disabled={isVoiceRecording}
        />
        
        <div className="absolute bottom-3 right-3 md:bottom-4 md:right-4">
          <Button
            onClick={onAddNote}
            disabled={!newNote.trim() || isLoading}
            className="h-9 w-9 p-0 rounded-full text-white shadow-sm hover:opacity-90"
            style={{ backgroundColor: '#8EA5E7' }}
          >
            {isLoading ? (
              <Square className="h-4 w-4" />
            ) : (
              <Plus className="h-6 w-6" />
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}