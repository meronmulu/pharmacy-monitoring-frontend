'use client'

import { useState } from "react"
import NavBar from '@/components/NavBar'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import Link from "next/link"

interface Medicine {
    id: number
    name: string
    price: number
    quantity: number
    expiryDate: string
}

// 🔥 Dummy Data
const demoMedicines: Medicine[] = [
    {
        id: 1,
        name: "Paracetamol",
        price: 10,
        quantity: 50,
        expiryDate: "2026-05-12"
    },
    {
        id: 2,
        name: "Amoxicillin",
        price: 25,
        quantity: 8,
        expiryDate: "2025-12-01"
    },
    {
        id: 3,
        name: "Ibuprofen",
        price: 15,
        quantity: 30,
        expiryDate: "2026-01-20"
    },
    {
        id: 4,
        name: "Cough Syrup",
        price: 40,
        quantity: 5,
        expiryDate: "2025-08-10"
    },
    {
        id: 5,
        name: "Vitamin C",
        price: 12,
        quantity: 100,
        expiryDate: "2027-03-14"
    },
    {
        id: 6,
        name: "Aspirin",
        price: 18,
        quantity: 2,
        expiryDate: "2025-06-05"
    }
]

export default function Page() {
    const [search, setSearch] = useState("")

    const filteredMedicines = demoMedicines.filter(m =>
        m.name.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className='flex flex-col gap-6'>

            <NavBar />

            <div className='px-10   min-h-screen rounded-lg'>

                {/* Header */}
                <div className='flex items-center justify-between mb-6'>
                    <div>
                        <h1 className='text-3xl font-bold text-gray-800'>
                            Medicine Inventory
                        </h1>
                        <p className='text-gray-500'>
                            Manage your pharmaceutical stock and pricing
                        </p>
                    </div>

                    <div className='flex items-center gap-4'>
                        <Input
                            placeholder="Search medicine..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-64"
                        />
                        <Link href="/dashboard/medicine/create">
                            <button className="px-4 py-2 bg-emerald-500 text-white rounded-md transition">
                                + Medicine
                            </button>
                        </Link>

                    </div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredMedicines.map((medicine) => {

                        const isLowStock = medicine.quantity <= 10
                        const isExpired = new Date(medicine.expiryDate) < new Date()

                        return (
                            <Card
                                key={medicine.id}
                                className="shadow-md hover:shadow-xl transition rounded-2xl"
                            >
                                <CardHeader>
                                    <CardTitle className="text-lg flex justify-between">
                                        {medicine.name}
                                        {isLowStock && (
                                            <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">
                                                Low Stock
                                            </span>
                                        )}
                                    </CardTitle>
                                    <CardDescription>
                                        Expires: {new Date(medicine.expiryDate).toLocaleDateString()}
                                    </CardDescription>
                                </CardHeader>

                                <CardContent>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">
                                            Stock: {medicine.quantity}
                                        </span>
                                        <span className="font-bold text-blue-600">
                                            ${medicine.price}
                                        </span>
                                    </div>

                                    {isExpired && (
                                        <p className="text-xs text-red-500 mt-2">
                                            ⚠ Expired
                                        </p>
                                    )}
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>

            </div>
        </div>
    )
}
