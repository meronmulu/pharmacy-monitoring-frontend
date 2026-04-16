'use client'


import Menu from "@/components/Menu"
import NavBar from "@/components/NavBar"
// import ProtectedRoute from "@/components/ProtectedRoute"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {


 

  return (
  // <ProtectedRoute roles={ ["ADMIN"]}>

    <div className="flex h-screen w-screen overflow-hidden">

      {/* Sidebar */}
      <div className="hidden md:block md:w-[180px] lg:w-[240px] bg-[#0F172A]">
        <Menu />
      </div>

      {/* Main Content */}
      <div className="flex-1 w-full flex flex-col h-full bg-[#F7F8FA]">
        <NavBar />
        <div className="p-2 flex-1 overflow-x-scroll">
          {children}
        </div>
      </div>
    </div>
  
  )
}