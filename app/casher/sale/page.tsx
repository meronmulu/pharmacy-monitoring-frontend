'use client'

import React, { useEffect, useState } from "react"
import { Sale } from "@/types"
import { useAuth } from "@/context/AuthContext"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import {
    Loader2,
    Calendar,
    ChevronDown,
    Filter,
} from "lucide-react"
import { getSalesByCashierId } from "@/service/saleService"
import { div } from "framer-motion/client"
import NavBar from "@/components/NavBar"
import ProtectedRoute from "@/components/ProtectedRoute"

// Date formatter
const ClientDate = ({ dateString }: { dateString: string }) => {
    if (!dateString) return <>—</>
    const date = new Date(dateString)
    const formatted = date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    })
    return <>{formatted}</>
}

export default function SalesPage() {
    const { user } = useAuth()

    const [allSales, setAllSales] = useState<Sale[]>([])
    const [sales, setSales] = useState<Sale[]>([])
    const [loading, setLoading] = useState(false)
    const [selectedFilter, setSelectedFilter] =
        useState<"all" | "daily" | "weekly" | "monthly">("all")
    const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set())
    const [searchTerm, setSearchTerm] = useState("")

    // ✅ Fetch Sales (ONLY logged-in cashier)
    const fetchSales = async () => {
        if (!user?.id) return

        try {
            setLoading(true)

            const data = await getSalesByCashierId(user.id)

            setAllSales(data || [])
            setSales(data || [])
        } catch (error) {
            console.error("Fetch sales error:", error)
            setAllSales([])
            setSales([])
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (user?.id) {
            fetchSales()
        }
    }, [user])

    // Date filter
    const filterSalesByDate = (
        filter: "all" | "daily" | "weekly" | "monthly"
    ) => {
        const now = new Date()
        let filtered = allSales

        if (filter === "daily") {
            filtered = allSales.filter(
                sale =>
                    new Date(sale.createdAt).toDateString() ===
                    now.toDateString()
            )
        } else if (filter === "weekly") {
            const weekAgo = new Date()
            weekAgo.setDate(now.getDate() - 7)
            filtered = allSales.filter(
                sale => new Date(sale.createdAt) >= weekAgo
            )
        } else if (filter === "monthly") {
            const monthAgo = new Date()
            monthAgo.setMonth(now.getMonth() - 1)
            filtered = allSales.filter(
                sale => new Date(sale.createdAt) >= monthAgo
            )
        }

        setSales(filtered)
        setSelectedFilter(filter)
    }

    // Search filter
    const filteredSales = sales.filter(sale => {
        if (!searchTerm) return true
        const term = searchTerm.toLowerCase()

        return (
            sale?.cashier?.name?.toLowerCase().includes(term) ||
            sale?.items?.some(item =>
                item?.medicine?.name?.toLowerCase().includes(term)
            ) ||
            sale?.status?.toLowerCase().includes(term)
        )
    })

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(amount)



    const getFilterButtonClass = (filter: typeof selectedFilter) => {
        const base =
            "px-3 py-1.5 text-xs font-medium rounded-md transition-all flex items-center gap-1 whitespace-nowrap"

        return selectedFilter === filter
            ? `${base} bg-emerald-600 text-white`
            : `${base} bg-white text-gray-600 border border-gray-200 hover:bg-gray-50`
    }

    return (
        <ProtectedRoute roles={["CASHIER"]}>

            <div>
                <div className="fixed top-0 left-0 w-full z-50 ">
                    <NavBar />
                </div>
                <div className="flex h-screen bg-gray-50 px-10 pt-14">
                    <div className="flex-1 flex flex-col overflow-hidden">

                        <div className="bg-white border-b border-gray-200 px-6 py-3 mt-5 md:flex md:items-center md:justify-between flex-col md:flex-row space-y-3 md:space-y-0">
                            <h1 className="text-xl font-semibold text-gray-800">Sales Overview</h1>
                            <div className="flex items-center gap-3">
                                <Input
                                    type="text"
                                    placeholder="Search transactions..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-9 pr-4 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 md:w-96 w-64"
                                />
                            </div>
                        </div>

                        {/* Filters */}
                        <div className="px-4 py-2">
                            <div className="bg-white rounded-lg border p-2 flex items-center justify-between overflow-x-auto">
                                <div className="flex items-center gap-3">
                                    <Filter size={14} />
                                    <span className="text-xs font-medium">Filter by:</span>

                                    <div className="flex gap-2">
                                        <button onClick={() => filterSalesByDate("all")} className={getFilterButtonClass("all")}><Calendar size={12} /> All</button>
                                        <button onClick={() => filterSalesByDate("daily")} className={getFilterButtonClass("daily")}><Calendar size={12} /> Daily</button>
                                        <button onClick={() => filterSalesByDate("weekly")} className={getFilterButtonClass("weekly")}><Calendar size={12} /> Weekly</button>
                                        <button onClick={() => filterSalesByDate("monthly")} className={getFilterButtonClass("monthly")}><Calendar size={12} /> Monthly</button>
                                    </div>
                                </div>

                                <span className="text-xs text-gray-500">
                                    {filteredSales.length} transactions
                                </span>
                            </div>
                        </div>

                        {/* Table */}
                        <div className="flex-1 px-4 pb-4 overflow-auto">
                            <div className="bg-white rounded-lg border overflow-hidden">
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Medicine</TableHead>
                                                <TableHead>Quantity</TableHead>
                                                <TableHead>Total</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead>Date</TableHead>
                                            </TableRow>
                                        </TableHeader>

                                        <TableBody>
                                            {loading ? (
                                                <TableRow>
                                                    <TableCell colSpan={6} className="text-center py-8">
                                                        <Loader2 className="h-5 w-5 animate-spin mx-auto" />
                                                    </TableCell>
                                                </TableRow>
                                            ) : filteredSales.length === 0 ? (
                                                <TableRow>
                                                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                                                        No sales found
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                filteredSales.map(sale => (
                                                    <TableRow key={sale.id}>

                                                        <TableCell>
                                                            {sale.items?.[0]?.medicine?.name}
                                                        </TableCell>
                                                        <TableCell>
                                                            {sale.items?.[0]?.quantity}
                                                        </TableCell>
                                                        <TableCell className="text-emerald-600 font-medium">
                                                            {formatCurrency(sale.total || 0)}
                                                        </TableCell>
                                                        <TableCell>{sale.status}</TableCell>
                                                        <TableCell>
                                                            <ClientDate dateString={sale.createdAt || ""} />
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            )}
                                        </TableBody>

                                    </Table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    )
}