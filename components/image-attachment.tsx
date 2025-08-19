"use client"

import { useRef, useState, forwardRef, useImperativeHandle } from "react"
import { X } from "lucide-react"

interface ImageAttachmentProps {
  maxImages?: number
  onImagesChange?: (images: string[]) => void
  className?: string
}

export interface ImageAttachmentRef {
  triggerFileSelect: () => void
  getImages: () => string[]
  clearImages: () => void
}

export const ImageAttachment = forwardRef<ImageAttachmentRef, ImageAttachmentProps>(({ 
  maxImages = 5, 
  onImagesChange,
  className = ""
}, ref) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedImages, setSelectedImages] = useState<string[]>([])

  const handleImageClick = () => {
    if (selectedImages.length < maxImages) {
      fileInputRef.current?.click()
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const remainingSlots = maxImages - selectedImages.length
      const filesToProcess = Array.from(files).slice(0, remainingSlots)
      
      filesToProcess.forEach(file => {
        if (file.type.startsWith('image/')) {
          const reader = new FileReader()
          reader.onload = (e) => {
            const result = e.target?.result as string
            setSelectedImages(prev => {
              const newImages = prev.length < maxImages ? [...prev, result] : prev
              // Notify parent component of changes
              if (onImagesChange) {
                onImagesChange(newImages)
              }
              return newImages
            })
          }
          reader.readAsDataURL(file)
        }
      })
    }
    // Reset the input so the same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const removeImage = (index: number) => {
    const newImages = selectedImages.filter((_, i) => i !== index)
    setSelectedImages(newImages)
    // Notify parent component of changes
    if (onImagesChange) {
      onImagesChange(newImages)
    }
  }

  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    triggerFileSelect: handleImageClick,
    getImages: () => selectedImages,
    clearImages: () => {
      setSelectedImages([])
      if (onImagesChange) {
        onImagesChange([])
      }
    }
  }))

  return (
    <>
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleImageChange}
        className="hidden"
        aria-label="Upload images"
      />
      
      {/* Display selected images */}
      {selectedImages.length > 0 && (
        <div className={`flex flex-wrap gap-2 ${className}`}>
          {selectedImages.map((image, index) => (
            <div key={index} className="relative inline-block group">
              <img 
                src={image} 
                alt={`Attachment ${index + 1}`} 
                className="max-h-20 rounded-lg border border-border opacity-60 hover:opacity-80 transition-opacity"
              />
              <button
                onClick={() => removeImage(index)}
                className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full flex items-center justify-center opacity-90 hover:opacity-100 transition-opacity"
                style={{ backgroundColor: 'var(--tidymind-orange)' }}
                aria-label={`Remove image ${index + 1}`}
              >
                <X className="h-3 w-3" style={{ color: 'white' }} />
              </button>
            </div>
          ))}
          {selectedImages.length < maxImages && (
            <button
              onClick={handleImageClick}
              className="h-20 px-4 rounded-lg border-2 border-dashed border-border/50 hover:border-border flex items-center justify-center text-xs text-muted-foreground hover:text-muted-foreground/80 transition-colors"
            >
              + Add {maxImages - selectedImages.length} more
            </button>
          )}
        </div>
      )}
    </>
  )
})

// Add display name for debugging
ImageAttachment.displayName = 'ImageAttachment'

// Export utility hook for parent components to control the attachment
export function useImageAttachment() {
  const [images, setImages] = useState<string[]>([])
  
  return {
    images,
    setImages,
    hasImages: images.length > 0,
    imageCount: images.length,
    clearImages: () => setImages([])
  }
}