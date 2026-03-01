'use client'

import { Button } from "@/components/ui/button"
import Link from "next/link"
import SupplierTable from "@/components/SupplierTable"

export default function Page() {
  return (
    <div className="p-4">
      <div className="flex items-center justify-between px-4 py-2">
        <h1 className="text-2xl font-bold mb-4">Supplier</h1> 
        <Button className="bg-emerald-500 text-white">
          
          <Link href="/dashboard/supplier/create">+ Supplier</Link>
        </Button>
      </div>
     
      <SupplierTable/>
    </div>
  )
}