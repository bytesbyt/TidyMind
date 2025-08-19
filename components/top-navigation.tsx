"use client"

import { useState, useEffect } from "react"
import { Search, Sun, Moon, User, Menu } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"
import { MobileMenu } from "./mobile-menu"
import Link from "next/link"

interface TopNavigationProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  transparentBg?: boolean
  whiteBg?: boolean
}

export function TopNavigation({ searchTerm, onSearchChange, transparentBg = true, whiteBg = false }: TopNavigationProps) {
  const [hasScrolled, setHasScrolled] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
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
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-12 pr-12 bg-muted border-transparent focus:bg-card focus:outline-none focus:ring-0 focus:border-transparent text-lg h-12 font-noto-sans rounded-full focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            <Button
              variant="ghost"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-10 w-10 p-0 rounded-full"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="h-12 w-12 text-muted-foreground " style={{ width: '20px', height: '20px' }} strokeWidth={1.5} />
            </Button>
          </div>
        </div>

        {/* Desktop View */}
        <div className="hidden md:block">
          <div className="relative flex items-center justify-between px-6">
            {/* Left spacer for centering */}
            <div className="w-24"></div>
            
            {/* Center Search Bar */}
            <div className="flex-1 flex justify-center">
              {showSearch && (
                <div className="max-w-md w-full">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                    <Input
                      placeholder="Search"
                      value={searchTerm}
                      onChange={(e) => onSearchChange(e.target.value)}
                      className="pl-12 bg-muted border-transparent focus:bg-card focus:outline-none focus:ring-0 focus:border-transparent text-lg h-10 font-noto-sans rounded-full focus-visible:ring-0 focus-visible:ring-offset-0"
                      autoFocus
                      onBlur={() => {
                        if (!searchTerm) {
                          setShowSearch(false)
                        }
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

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
              <button
                className="h-12 w-12 p-0 flex items-center justify-center"
                onClick={() => setShowSearch(true)}
              >
                <Search className="h-10 w-10 text-muted-foreground" style={{ width: '20px', height: '20px' }} strokeWidth={1.5} />
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
