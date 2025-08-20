"use client"

import { useState, useEffect } from "react"
import { Sun, Moon, User, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"
import { MobileMenu } from "./mobile-menu"
import Link from "next/link"

interface TopNavigationProps {
  transparentBg?: boolean
  whiteBg?: boolean
}

export function TopNavigation({ transparentBg = true, whiteBg = false }: TopNavigationProps) {
  const [hasScrolled, setHasScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 0)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <>
      <div className={cn(
        "fixed top-0 left-0 md:left-20 right-0 z-30 pt-4 md:pt-8 pb-3 md:pb-5 transition-all duration-300",
        whiteBg
          ? hasScrolled 
            ? "bg-white/95 dark:bg-card/95 backdrop-blur-xl shadow-lg border-b border-border/30" 
            : "bg-white dark:bg-card"
          : transparentBg
            ? hasScrolled 
              ? "bg-background/20 backdrop-blur-xl shadow-lg border-b border-border/20" 
              : "bg-transparent backdrop-blur-sm"
            : hasScrolled
              ? "bg-background/95 backdrop-blur-xl shadow-lg border-b border-border/30"
              : "bg-background"
      )}>
        {/* Mobile View */}
        <div className="md:hidden px-4">
          <div className="flex justify-end">
            <Button
              variant="ghost"
              className="h-10 w-10 p-0 rounded-full"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="h-12 w-12 text-muted-foreground" style={{ width: '20px', height: '20px' }} strokeWidth={1.5} />
            </Button>
          </div>
        </div>

        {/* Desktop View */}
        <div className="hidden md:block">
          <div className="relative flex items-center justify-between px-6">
            {/* Left spacer for centering */}
            <div className="w-24"></div>
            
            {/* Center spacer */}
            <div className="flex-1"></div>

            {/* Action Icons - Far Right */}
            <div className="flex items-center gap-2 w-24 justify-end">
              <button 
                className="h-12 w-12 p-0 flex items-center justify-center"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                {!mounted ? null : theme === "dark" ? (
                  <Sun className="h-12 w-12 text-muted-foreground" style={{ width: '20px', height: '20px' }} strokeWidth={1.5} />
                ) : (
                  <Moon className="h-12 w-12 text-muted-foreground" style={{ width: '20px', height: '20px' }} strokeWidth={1.5} />
                )}
              </button>
              <Link href="/login" className="h-12 w-12 flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity">
                <User className="text-muted-foreground" style={{ width: '20px', height: '20px' }} strokeWidth={1.5} />  
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </>
  )
}
