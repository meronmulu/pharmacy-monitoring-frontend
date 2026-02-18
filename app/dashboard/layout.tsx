'use client'

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import Menu from "@/components/Menu"
import NavBar from "@/components/NavBar"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if ( user?.role !== "ADMIN") {
      router.replace("/")
    }
  }, [user])


  if (user?.role !== "ADMIN") return null

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <div className="hidden md:block sm:w-[100px] md:w-[180px] lg:w-[240px] bg-[#0F172A] border-r border-gray-200">
        <Menu />
      </div>

      <div className="flex-1 w-full flex flex-col h-full bg-[#F7F8FA]">
        <NavBar />
        <div className="p-2 flex-1 overflow-x-scroll">{children}</div>
      </div>
    </div>
  )
}
