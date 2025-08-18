"use client"

import { Search, RefreshCw, Calendar, MoreHorizontal } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface TopNavigationProps {
  searchTerm: string
  onSearchChange: (value: string) => void
}

export function TopNavigation({ searchTerm, onSearchChange }: TopNavigationProps) {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm px-6 py-5">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* User Profile Section */}
        <div className="flex items-center gap-3">
          <Avatar className="h-13 w-13">
            <AvatarImage src="/placeholder.svg?height=48&width=48" />
            <AvatarFallback className="bg-indigo-100 text-indigo-600 text-base font-medium">MJ</AvatarFallback>
          </Avatar>
          <div className="hidden sm:block">
            <div className="text-lg font-medium text-gray-900 font-sans">Mahdi Jafili</div>
            <div className="text-base text-gray-500 font-sans">mahdijafiliuui@gmail.com</div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-md mx-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-6 w-6" />
            <Input
              placeholder="Search anything..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-12 bg-gray-50 border-gray-200 focus:bg-white text-lg h-12 font-sans"
            />
          </div>
        </div>

        {/* Action Icons */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="h-10 w-10 p-0">
            <RefreshCw className="h-6 w-6 text-gray-600" />
          </Button>
          <Button variant="ghost" size="sm" className="h-10 w-10 p-0">
            <Calendar className="h-6 w-6 text-gray-600" />
          </Button>
          <Button variant="ghost" size="sm" className="h-10 w-10 p-0">
            <MoreHorizontal className="h-6 w-6 text-gray-600" />
          </Button>
        </div>
      </div>
    </div>
  )
}
