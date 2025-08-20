"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { X, FolderOpen, Calendar, Sun, Moon, User, LogIn } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  
  // Use black logo in light mode, white logo in dark mode
  const logoSrc = mounted && theme === "dark" ? "/tm_side_white0.png" : "/tm_side_black0.png"

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />
      
      {/* Menu Panel */}
      <div className="absolute left-0 top-0 h-full w-64 bg-card border-r border-border shadow-lg">
        <div className="flex flex-col h-full p-6">
          {/* Header with Logo and Close Button */}
          <div className="flex items-center justify-between mb-8">
            <Link href="/" onClick={onClose}>
              <Image 
                src={logoSrc} 
                alt="TidyMind Logo" 
                width={120} 
                height={30} 
                className="object-contain cursor-pointer"
              />
            </Link>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={onClose}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 space-y-2">
            <Link href="/collections" onClick={onClose}>
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 h-12"
              >
                <FolderOpen className="h-5 w-5" />
                <span>Collections</span>
              </Button>
            </Link>

            <Button
              variant="ghost"
              className="w-full justify-start gap-3 h-12"
              onClick={() => {
                console.log("Navigate to Calendar")
                onClose()
              }}
            >
              <Calendar className="h-5 w-5" />
              <span>Calendar</span>
            </Button>
          </nav>

          {/* Bottom Actions */}
          <div className="space-y-2 pt-4 border-t border-border">
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 h-12"
              onClick={() => {
                setTheme(theme === "dark" ? "light" : "dark")
              }}
            >
              {!mounted ? null : theme === "dark" ? (
                <>
                  <Sun className="h-5 w-5" />
                  <span>Light Mode</span>
                </>
              ) : (
                <>
                  <Moon className="h-5 w-5" />
                  <span>Dark Mode</span>
                </>
              )}
            </Button>

            <Button
              variant="ghost"
              className="w-full justify-start gap-3 h-12"
              onClick={() => {
                console.log("Navigate to Profile")
                onClose()
              }}
            >
              <User className="h-5 w-5" />
              <span>Profile</span>
            </Button>

            <Button
              variant="ghost"
              className="w-full justify-start gap-3 h-12"
              onClick={() => {
                console.log("Navigate to Login/Signup")
                onClose()
              }}
            >
              <LogIn className="h-5 w-5" />
              <span>Login / Sign Up</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}