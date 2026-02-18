'use client'

import MedicinesTable from "@/components/MedicinesTable"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Page() {
  return (
    <div className="px-4 pt-16 pb-4">
      <div className="flex items-center justify-between px-4 py-2">
        <h1 className="text-2xl font-bold mb-4">Medicines</h1> 
        <Button className="bg-emerald-500 text-white">
          
          <Link href="/dashboard/medicine/create">+ Medicines</Link>
        </Button>
      </div>
      <MedicinesTable/>
    </div>
  )
}
