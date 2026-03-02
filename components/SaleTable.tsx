'use client'

import React, { useEffect, useState } from "react"
import { Sale } from "@/types"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Loader2,
  Calendar,
  ChevronDown,
  Filter,
  Trash2,
} from "lucide-react"
import { deleteSale, getAllSales } from "@/service/saleService"
import { Input } from "./ui/input"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog"
import { Button } from "./ui/button"

// Client-safe date formatter
const ClientDate = ({ dateString }: { dateString: string }) => {
  if (!dateString) return <>—</>
  const date = new Date(dateString)
  const formatted = date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
  return <>{formatted}</>
}

export default function SalesPage() {
  const [allSales, setAllSales] = useState<Sale[]>([])
  const [sales, setSales] = useState<Sale[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'daily' | 'weekly' | 'monthly'>('all')
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set())
  const [searchTerm, setSearchTerm] = useState("")
  const [deletingId, setDeletingId] = useState<number | null>(null)

  // Fetch all sales from backend
  const fetchSales = async () => {
    try {
      setLoading(true)
      const data = await getAllSales()
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
    fetchSales()
  }, [])

  // Filter sales by date
  const filterSalesByDate = (filter: 'all' | 'daily' | 'weekly' | 'monthly') => {
    const now = new Date()
    let filtered = allSales

    if (filter === 'daily') {
      filtered = allSales.filter(sale => new Date(sale.createdAt).toDateString() === now.toDateString())
    } else if (filter === 'weekly') {
      const weekAgo = new Date(now)
      weekAgo.setDate(now.getDate() - 7)
      filtered = allSales.filter(sale => new Date(sale.createdAt) >= weekAgo)
    } else if (filter === 'monthly') {
      const monthAgo = new Date(now)
      monthAgo.setMonth(now.getMonth() - 1)
      filtered = allSales.filter(sale => new Date(sale.createdAt) >= monthAgo)
    }

    setSales(filtered)
    setSelectedFilter(filter)
  }

  // Filter sales by search term
  const filteredSales = sales.filter(sale => {
    if (!searchTerm) return true
    const term = searchTerm.toLowerCase()
    return (
      sale?.cashier?.name?.toLowerCase().includes(term) ||
      sale?.items?.some(item => item?.medicine?.name?.toLowerCase().includes(term)) ||
      sale?.status?.toLowerCase().includes(term)
    )
  })

  // Summary statistics
  const summary = {
    totalSales: filteredSales.reduce((sum, sale) => sum + (sale.total || 0), 0),
    totalTransactions: filteredSales.length,
    totalItems: filteredSales.reduce(
      (sum, sale) => sum + (sale.items?.reduce((a, i) => a + (i.quantity || 0), 0) || 0),
      0
    ),
  }

 

  const getFilterButtonClass = (filter: typeof selectedFilter) => {
    const base = "px-3 py-1.5 text-xs font-medium rounded-md transition-all flex items-center gap-1 whitespace-nowrap"
    return selectedFilter === filter
      ? `${base} bg-emerald-600 text-white shadow-sm`
      : `${base} bg-white text-gray-600 hover:bg-gray-50 border border-gray-200`
  }

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount)

  const getStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'COMPLETED': return 'bg-green-100 text-green-700 border-green-200'
      case 'PENDING': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'CANCELLED': return 'bg-red-100 text-red-700 border-red-200'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

   const handleDelete = async (id: number) => {
  try {
    setDeletingId(id)

    await deleteSale(id)

    setAllSales((prev) => prev.filter((sale) => sale.id !== id))

    setSales((prev) => prev.filter((sale) => sale.id !== id))

  } catch (error) {
    console.error("Delete failed:", error)
  } finally {
    setDeletingId(null)
  }
}

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-3 md:flex md:items-center md:justify-between flex-col md:flex-row space-y-3 md:space-y-0">
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

        {/* Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4">
          <div className="bg-white rounded-lg p-3 border border-gray-200">
            <p className="text-xs text-gray-500">Total Revenue</p>
            <p className="text-lg font-semibold text-gray-800 mt-1">
              {formatCurrency(summary.totalSales)}  ETB
            </p>
          </div>
          <div className="bg-white rounded-lg p-3 border border-gray-200">
            <p className="text-xs text-gray-500">Transactions</p>
            <p className="text-lg font-semibold text-gray-800 mt-1">{summary.totalTransactions}</p>
          </div>
          <div className="bg-white rounded-lg p-3 border border-gray-200">
            <p className="text-xs text-gray-500">Items Sold</p>
            <p className="text-lg font-semibold text-gray-800 mt-1">{summary.totalItems}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="px-4 pb-2">
          <div className="bg-white rounded-lg border border-gray-200 p-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            <div className="flex items-center gap-4 flex-nowrap">
              <Filter size={14} className="text-gray-400 flex-shrink-0" />
              <span className="text-xs font-medium text-gray-600 flex-shrink-0">Filter by:</span>
              <div className="flex gap-4">
                <button onClick={() => filterSalesByDate('all')} className={getFilterButtonClass('all')}><Calendar size={12} /> All Time</button>
                <button onClick={() => filterSalesByDate('daily')} className={getFilterButtonClass('daily')}><Calendar size={12} /> Daily</button>
                <button onClick={() => filterSalesByDate('weekly')} className={getFilterButtonClass('weekly')}><Calendar size={12} /> Weekly</button>
                <button onClick={() => filterSalesByDate('monthly')} className={getFilterButtonClass('monthly')}><Calendar size={12} /> Monthly</button>
              </div>
            </div>
            <span className="text-xs text-gray-500 flex-shrink-0">
              Showing <span className="font-medium text-gray-700">{filteredSales.length}</span> transactions
            </span>
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 px-4 pb-4 overflow-auto">
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-gray-50">
                  <TableRow>
                    <TableHead className="text-xs font-semibold text-gray-600 px-3 py-2">Cashier</TableHead>
                    <TableHead className="text-xs font-semibold text-gray-600 px-3 py-2">Medicine</TableHead>
                    <TableHead className="text-xs font-semibold text-gray-600 pl-3 py-2 text-right">Quantity</TableHead>
                    <TableHead className="text-xs font-semibold text-gray-600 p-10  py-2 text-right">Price</TableHead>
                    <TableHead className="text-xs font-semibold text-gray-600 pr-14 py-2 text-right">Total</TableHead>
                    <TableHead className="text-xs font-semibold text-gray-600 px-3 py-2">Status</TableHead>
                    <TableHead className="text-xs font-semibold text-gray-600 px-3 py-2">Date</TableHead>
                    <TableHead className="text-xs font-semibold text-gray-600 px-3 py-2">Action</TableHead>


                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-8">
                        <Loader2 className="h-5 w-5 animate-spin text-emerald-600 mx-auto" />
                      </TableCell>
                    </TableRow>
                  ) : filteredSales.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-8 text-gray-500 text-sm">
                        No sales found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredSales.map(sale => (
                      <React.Fragment key={sale.id}>
                        <TableRow className="hover:bg-gray-50 border-b border-gray-100">
                          
                          <TableCell className="px-3 py-2 text-sm font-medium text-gray-800">{sale.cashier?.name || '—'}</TableCell>
                          <TableCell className="px-3 py-2 text-sm text-gray-700">
                            {sale.items?.[0]?.medicine?.name || '—'}
                            {sale.items && sale.items.length > 1 && <span className="ml-1 text-xs text-gray-400">+{sale.items.length - 1}</span>}
                          </TableCell>
                          <TableCell className=" pr-7 py-2 text-right text-sm text-gray-700">{sale.items?.[0]?.quantity || 0}</TableCell>
                          <TableCell className="pl-4 py-2 text-right text-sm text-gray-700">{formatCurrency(sale.items?.[0]?.price || 0)} ETB</TableCell>
                          <TableCell className="py-2  pr-5 text-right text-sm font-medium text-emerald-600">{formatCurrency(sale.total || 0)} ETB</TableCell>
                          <TableCell className="px-3 py-2">
                            <span className={`inline-block px-4 py-0.5 text-xs font-medium rounded-full border ${getStatusColor(sale.status || '')}`}>
                              {sale.status || 'UNKNOWN'}
                            </span>
                          </TableCell>
                          <TableCell className="px-3 py-2 text-sm text-gray-600">
                            <ClientDate dateString={sale.createdAt || ''} />
                          </TableCell>
                          <TableCell className="">


                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="text-red-600 hover:bg-red-100"
                                >
                                  <Trash2 size={18} />
                                </Button>
                              </AlertDialogTrigger>

                              <AlertDialogContent className="bg-white  ">
                                <AlertDialogHeader>
                                  <AlertDialogTitle className="text-center">
                                    Delete User
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This action cannot be undone. This will permanently
                                    delete
                                  </AlertDialogDescription>
                                </AlertDialogHeader>

                                <AlertDialogFooter className="flex justify-center gap-4 sm:justify-center">
                                  <AlertDialogCancel>
                                    Cancel
                                  </AlertDialogCancel>

                                  <AlertDialogAction
                                    onClick={() => handleDelete(sale.id)}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    {deletingId === sale.id ? (
                                      <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                      "Delete"
                                    )}
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </TableCell>
                        </TableRow>
                      </React.Fragment>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}