"use client"

import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from "react"
import { Mic, X, Check, Square } from "lucide-react"
import { Button } from "@/components/ui/button"

interface VoiceRecordingProps {
  onTranscript?: (text: string) => void
  onRecordingStateChange?: (isRecording: boolean) => void
  className?: string
}

export interface VoiceRecordingRef {
  startRecording: () => void
  stopRecording: () => void
  cancelRecording: () => void
  isRecording: boolean
}

export const VoiceRecording = forwardRef<VoiceRecordingRef, VoiceRecordingProps>(({
  onTranscript,
  onRecordingStateChange,
  className = ""
}, ref) => {
  const [isRecording, setIsRecording] = useState(false)
  const [isStopped, setIsStopped] = useState(false)
  const [recordingDuration, setRecordingDuration] = useState(0)
  const [transcript, setTranscript] = useState("")
  const [showRecordingUI, setShowRecordingUI] = useState(false)
  const recognitionRef = useRef<any>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = true
      recognitionRef.current.interimResults = true
      recognitionRef.current.lang = 'en-US'

      recognitionRef.current.onresult = (event: any) => {
        let interimTranscript = ''
        let finalTranscript = ''

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' '
          } else {
            interimTranscript += transcript
          }
        }

        setTranscript(prev => prev + finalTranscript)
      }

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error)
        stopRecording()
      }

      recognitionRef.current.onend = () => {
        if (isRecording) {
          // Restart if still recording
          recognitionRef.current?.start()
        }
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [isRecording])

  const startRecording = () => {
    setIsRecording(true)
    setIsStopped(false)
    setShowRecordingUI(true)
    setTranscript("")
    setRecordingDuration(0)
    
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start()
      } catch (error) {
        console.log("Speech recognition already started")
      }
    }

    // Start duration timer
    timerRef.current = setInterval(() => {
      setRecordingDuration(prev => prev + 1)
    }, 1000)

    onRecordingStateChange?.(true)
  }

  const stopRecording = () => {
    setIsRecording(false)
    setIsStopped(true)
    
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }

    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }

    onRecordingStateChange?.(false)
  }

  const confirmRecording = () => {
    if (!isRecording) {
      // Already stopped, just save
      if (transcript.trim()) {
        onTranscript?.(transcript.trim())
      }
    } else {
      // Stop first, then save
      stopRecording()
      if (transcript.trim()) {
        onTranscript?.(transcript.trim())
      }
    }
    setShowRecordingUI(false)
    setIsStopped(false)
    setTranscript("")
    setRecordingDuration(0)
  }

  const cancelRecording = () => {
    if (isRecording) {
      stopRecording()
    }
    setShowRecordingUI(false)
    setIsStopped(false)
    setTranscript("")
    setRecordingDuration(0)
  }

  // Format duration to mm:ss
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // Expose methods to parent
  useImperativeHandle(ref, () => ({
    startRecording,
    stopRecording,
    cancelRecording,
    isRecording
  }))

  if (showRecordingUI) {
    return (
      <div className={`flex items-center gap-1 ${className}`}>
        {isRecording && (
          <Button
            variant="ghost"
            className="h-10 w-10 p-0 rounded-full hover:opacity-90"
            style={{ backgroundColor: 'var(--tidymind-orange)' }}
            onClick={stopRecording}
            title="Stop recording"
          >
            <Square className="h-4 w-4 text-white fill-white" />
          </Button>
        )}
        {isStopped && (
          <>
            <Button
              variant="ghost"
              className="h-10 w-10 p-0 rounded-full hover:bg-orange-100 dark:hover:bg-orange-900/20"
              onClick={cancelRecording}
              title="Cancel and discard"
            >
              <X className="h-5 w-5" style={{ color: 'var(--tidymind-orange)' }} />
            </Button>
            <Button
              variant="ghost"
              className="h-10 w-10 p-0 rounded-full hover:bg-green-100 dark:hover:bg-green-900/20"
              onClick={confirmRecording}
              title="Save transcript"
              disabled={!transcript.trim()}
            >
              <Check className={`h-5 w-5 ${transcript.trim() ? 'text-green-600' : 'text-muted-foreground/50'}`} />
            </Button>
          </>
        )}
      </div>
    )
  }

  return (
    <Button
      variant="ghost"
      className="h-10 w-10 p-0 rounded-full"
      onClick={startRecording}
      title="Start voice recording"
    >
      <Mic className="text-muted-foreground" style={{ width: '20px', height: '20px' }} strokeWidth={1.5} />
    </Button>
  )
})

VoiceRecording.displayName = 'VoiceRecording'

// Utility hook for managing voice recording state
export function useVoiceRecording() {
  const [transcript, setTranscript] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  
  return {
    transcript,
    setTranscript,
    isRecording,
    setIsRecording,
    clearTranscript: () => setTranscript("")
  }
}