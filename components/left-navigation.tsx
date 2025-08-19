"use client"

import Image from "next/image"
import Link from "next/link"
import { FolderOpen, Calendar } from "lucide-react"
import { useState, useEffect } from "react"
import { useTheme } from "next-themes"

export function LeftNavigation() {
  const [hoveredButton, setHoveredButton] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const { theme, systemTheme } = useTheme()
  
  useEffect(() => {
    setMounted(true)
  }, [])
  
  const currentTheme = theme === "system" ? systemTheme : theme
  const logoSrc = mounted && currentTheme === "dark" ? "/tm_side_white.png" : "/tm_side_black.png"

  return (
    <div className="hidden md:flex fixed left-0 top-0 h-full w-20 bg-card border-r border-border flex-col items-center py-2 z-40">
      {/* Logo */}
      <div className="mb-8 mt-12 flex flex-col items-center">
        <Link href="/">
          <Image src={logoSrc} alt="Logo" width={24} height={19} className="object-contain cursor-pointer" />
        </Link>
      </div>


      {/* Navigation Icons */}
      <div className="flex flex-col gap-2 flex-1">
        <div className="relative flex items-center">
          <Link href="/collections">
            <div 
              className="h-12 w-12 flex items-center justify-center cursor-pointer"
              onMouseEnter={() => setHoveredButton('collections')}
              onMouseLeave={() => setHoveredButton(null)}
            >
              <FolderOpen className="text-foreground" style={{ width: '23px', height: '23px' }} strokeWidth={2} />
            </div>
          </Link>
          {hoveredButton === 'collections' && (
            <div className="absolute left-12 ml-1 px-2 py-1 bg-black dark:bg-white text-white dark:text-black text-sm rounded shadow-md whitespace-nowrap z-50 pointer-events-none">
              Collections
            </div>
          )}
        </div>
        
        <div className="relative flex items-center">
          <Link href="/calendar">
            <div 
              className="h-12 w-12 flex items-center justify-center cursor-pointer"
              onMouseEnter={() => setHoveredButton('calendar')}
              onMouseLeave={() => setHoveredButton(null)}
            >
              <Calendar className="text-foreground" style={{ width: '23px', height: '23px' }} strokeWidth={2} />
            </div>
          </Link>
          {hoveredButton === 'calendar' && (
            <div className="absolute left-12 ml-1 px-2 py-1 bg-black dark:bg-white text-white dark:text-black text-sm rounded shadow-md whitespace-nowrap z-50">
              Calendar
            </div>
          )}
        </div>
      </div>
    </div>
  )
}