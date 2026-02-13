'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { LogOut, Search, User } from "lucide-react"

export default function NavBar() {
  return (
    <header className="w-full h-16 bg-white border-b flex items-center justify-between px-6 shadow-sm">
      
      {/* Left: App Name */}
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">
          P
        </div>
        <span className="text-lg font-semibold text-gray-800">
          Pharmacy Monitor
        </span>
      </div>

      

      {/* Right: User */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <User size={18} />
          <span>Cashier</span>
        </div>

        <Button variant="outline" size="sm" className="flex gap-2">
          <LogOut size={16} />
          Logout
        </Button>
      </div>

    </header>
  )
}
  