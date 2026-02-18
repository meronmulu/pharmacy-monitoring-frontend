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
import { Button } from "@/components/ui/button"
import { 
    Loader2, 
    Calendar, 
    Download, 
    Filter, 
    Eye, 
    ChevronDown,
    Clock,
    TrendingUp,
    DollarSign,
    Package,
    Search
} from "lucide-react"
import { getAllSales, dailyReport, weeklyReport, monthlyReport } from "@/service/saleService"

// Client-safe date formatter using native JavaScript
const ClientDate = ({ dateString }: { dateString: string }) => {
    const [formatted, setFormatted] = useState("")
    
    useEffect(() => {
        if (!dateString) return
        
        const date = new Date(dateString)
        
        // Format: "Jan 15, 2024"
        const options: Intl.DateTimeFormatOptions = {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        }
        
        setFormatted(date.toLocaleString('en-US', options))
    }, [dateString])
    
    return <>{formatted}</>
}

export default function SalesPage() {
    const [sales, setSales] = useState<Sale[]>([])
    const [loading, setLoading] = useState(false)
    const [selectedFilter, setSelectedFilter] = useState<'all' | 'daily' | 'weekly' | 'monthly'>('all')
    const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())
    const [searchTerm, setSearchTerm] = useState("")

    // Fetch all sales initially
    const fetchSales = async () => {
        try {
            setLoading(true)
            const data = await getAllSales()
            setSales(data || [])
        } catch (error) {
            console.error("Fetch sales error:", error)
            setSales([])
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchSales()
    }, [])

    // Filter buttons handlers
    const handleDaily = async () => {
        try {
            setLoading(true)
            const data = await dailyReport()
            setSales(data || [])
            setSelectedFilter('daily')
        } catch (error) {
            console.error(error)
            setSales([])
        } finally {
            setLoading(false)
        }
    }

    const handleWeekly = async () => {
        try {
            setLoading(true)
            const data = await weeklyReport()
            setSales(data || [])
            setSelectedFilter('weekly')
        } catch (error) {
            console.error(error)
            setSales([])
        } finally {
            setLoading(false)
        }
    }

    const handleMonthly = async () => {
        try {
            setLoading(true)
            const data = await monthlyReport()
            setSales(data || [])
            setSelectedFilter('monthly')
        } catch (error) {
            console.error(error)
            setSales([])
        } finally {
            setLoading(false)
        }
    }

    // Filter sales based on search term
    const filteredSales = Array.isArray(sales) ? sales.filter(sale => {
        if (!searchTerm) return true;
        const searchLower = searchTerm.toLowerCase();
        return (
            sale?.cashier?.name?.toLowerCase().includes(searchLower) ||
            sale?.items?.some(item => item?.medicine?.name?.toLowerCase().includes(searchLower)) ||
            sale?.status?.toLowerCase().includes(searchLower)
        );
    }) : [];

    // Calculate summary statistics with safe checks
    const summary = {
        totalSales: Array.isArray(filteredSales) && filteredSales.length > 0 
            ? filteredSales.reduce((sum, sale) => sum + (sale?.total || 0), 0) 
            : 0,
        totalTransactions: Array.isArray(filteredSales) ? filteredSales.length : 0,
        totalItems: Array.isArray(filteredSales) && filteredSales.length > 0
            ? filteredSales.reduce((sum, sale) => {
                const itemsTotal = sale?.items?.reduce((itemSum, item) => 
                    itemSum + (item?.quantity || 0), 0
                ) || 0;
                return sum + itemsTotal;
            }, 0)
            : 0,
        averageTransaction: Array.isArray(filteredSales) && filteredSales.length > 0 
            ? filteredSales.reduce((sum, sale) => sum + (sale?.total || 0), 0) / filteredSales.length 
            : 0
    }

    const toggleRow = (saleId: string) => {
        const newExpanded = new Set(expandedRows)
        if (newExpanded.has(saleId)) {
            newExpanded.delete(saleId)
        } else {
            newExpanded.add(saleId)
        }
        setExpandedRows(newExpanded)
    }

    const getFilterButtonClass = (filter: typeof selectedFilter) => {
        const baseClass = "px-3 py-1.5 text-xs font-medium rounded-md transition-all flex items-center gap-1"
        return selectedFilter === filter
            ? `${baseClass} bg-emerald-600 text-white shadow-sm`
            : `${baseClass} bg-white text-gray-600 hover:bg-gray-50 border border-gray-200`
    }

    // Format currency
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount || 0)
    }

    const getStatusColor = (status: string) => {
        switch(status?.toUpperCase()) {
            case 'COMPLETED':
                return 'bg-green-100 text-green-700 border-green-200';
            case 'PENDING':
                return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'CANCELLED':
                return 'bg-red-100 text-red-700 border-red-200';
            default:
                return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    }

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
                <div className="p-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-800">PharmacyMonitor</h2>
                    <p className="text-xs text-gray-500 mt-1">Sales Dashboard</p>
                </div>
                
                <div className="flex-1 p-4">
                    <div className="space-y-1">
                        <Button variant="ghost" className="w-full justify-start gap-2 text-sm font-normal">
                            <LayoutDashboard size={16} />
                            Dashboard
                        </Button>
                        <Button variant="ghost" className="w-full justify-start gap-2 text-sm font-normal bg-emerald-50 text-emerald-700">
                            <ShoppingCart size={16} />
                            Sales
                        </Button>
                        <Button variant="ghost" className="w-full justify-start gap-2 text-sm font-normal">
                            <Users size={16} />
                            User Management
                        </Button>
                        <Button variant="ghost" className="w-full justify-start gap-2 text-sm font-normal">
                            <Pill size={16} />
                            Medicine Management
                        </Button>
                        <Button variant="ghost" className="w-full justify-start gap-2 text-sm font-normal">
                            <Settings size={16} />
                            Settings
                        </Button>
                    </div>
                </div>
                
                <div className="p-4 border-t border-gray-200">
                    <Button variant="ghost" className="w-full justify-start gap-2 text-sm font-normal text-red-600">
                        <LogOut size={16} />
                        Logout
                    </Button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <div className="bg-white border-b border-gray-200 px-6 py-3">
                    <div className="flex items-center justify-between">
                        <h1 className="text-xl font-semibold text-gray-800">Sales Overview</h1>
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                <input
                                    type="text"
                                    placeholder="Search transactions..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-9 pr-4 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 w-64"
                                />
                            </div>
                            <Button variant="outline" size="sm" className="gap-1 text-xs">
                                <Download size={14} />
                                Export
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-4 gap-3 p-4">
                    <div className="bg-white rounded-lg p-3 border border-gray-200">
                        <p className="text-xs text-gray-500">Total Revenue</p>
                        <p className="text-lg font-semibold text-gray-800 mt-1">
                            ETB {formatCurrency(summary.totalSales)}
                        </p>
                    </div>
                    <div className="bg-white rounded-lg p-3 border border-gray-200">
                        <p className="text-xs text-gray-500">Transactions</p>
                        <p className="text-lg font-semibold text-gray-800 mt-1">
                            {summary.totalTransactions}
                        </p>
                    </div>
                    <div className="bg-white rounded-lg p-3 border border-gray-200">
                        <p className="text-xs text-gray-500">Items Sold</p>
                        <p className="text-lg font-semibold text-gray-800 mt-1">
                            {summary.totalItems}
                        </p>
                    </div>
                    <div className="bg-white rounded-lg p-3 border border-gray-200">
                        <p className="text-xs text-gray-500">Average</p>
                        <p className="text-lg font-semibold text-gray-800 mt-1">
                            ETB {formatCurrency(summary.averageTransaction)}
                        </p>
                    </div>
                </div>

                {/* Filters */}
                <div className="px-4 pb-2">
                    <div className="bg-white rounded-lg border border-gray-200 p-2">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Filter size={14} className="text-gray-400" />
                                <span className="text-xs font-medium text-gray-600">Filter by:</span>
                                <div className="flex gap-1">
                                    <button onClick={fetchSales} className={getFilterButtonClass('all')}>
                                        <Calendar size={12} />
                                        All Time
                                    </button>
                                    <button onClick={handleDaily} className={getFilterButtonClass('daily')}>
                                        <Calendar size={12} />
                                        Daily
                                    </button>
                                    <button onClick={handleWeekly} className={getFilterButtonClass('weekly')}>
                                        <Calendar size={12} />
                                        Weekly
                                    </button>
                                    <button onClick={handleMonthly} className={getFilterButtonClass('monthly')}>
                                        <Calendar size={12} />
                                        Monthly
                                    </button>
                                </div>
                            </div>
                            <span className="text-xs text-gray-500">
                                Showing <span className="font-medium text-gray-700">{filteredSales.length}</span> transactions
                            </span>
                        </div>
                    </div>
                </div>

                {/* Table */}
               <div className="flex-1 px-4 pb-4 overflow-auto">
                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader className="bg-gray-50">
                                    <TableRow>
                                        <TableHead className="w-6 px-2 py-2"></TableHead>
                                        <TableHead className="text-xs font-semibold text-gray-600 px-3 py-2">Cashier</TableHead>
                                        <TableHead className="text-xs font-semibold text-gray-600 px-3 py-2">Medicine</TableHead>
                                        <TableHead className="text-xs font-semibold text-gray-600 px-3 py-2 text-right">Qty</TableHead>
                                        <TableHead className="text-xs font-semibold text-gray-600 px-3 py-2 text-right">Price</TableHead>
                                        <TableHead className="text-xs font-semibold text-gray-600 px-3 py-2 text-right">Total</TableHead>
                                        <TableHead className="text-xs font-semibold text-gray-600 px-3 py-2">Status</TableHead>
                                        <TableHead className="text-xs font-semibold text-gray-600 px-3 py-2">Date</TableHead>
                                        <TableHead className="w-6 px-2 py-2"></TableHead>
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
                                        filteredSales.map((sale) => (
                                            <React.Fragment key={sale?.id}>
                                                <TableRow className="hover:bg-gray-50 border-b border-gray-100">
                                                    <TableCell className="px-2 py-2">
                                                        {sale?.items && sale.items.length > 1 && (
                                                            <ChevronDown 
                                                                size={14} 
                                                                className={`text-gray-400 cursor-pointer transition-transform ${
                                                                    sale?.id && expandedRows.has(sale.id) ? 'rotate-180' : ''
                                                                }`}
                                                                onClick={() => sale?.id && toggleRow(sale.id)}
                                                            />
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="px-3 py-2">
                                                        <span className="text-sm font-medium text-gray-800">
                                                            {sale?.cashier?.name || '—'}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className="px-3 py-2">
                                                        <span className="text-sm text-gray-700">
                                                            {sale?.items?.[0]?.medicine?.name || '—'}
                                                            {sale?.items && sale.items.length > 1 && (
                                                                <span className="ml-1 text-xs text-gray-400">
                                                                    +{sale.items.length - 1}
                                                                </span>
                                                            )}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className="px-3 py-2 text-right text-sm text-gray-700">
                                                        {sale?.items?.[0]?.quantity || 0}
                                                    </TableCell>
                                                    <TableCell className="px-3 py-2 text-right text-sm text-gray-700">
                                                        {formatCurrency(sale?.items?.[0]?.price || 0)}
                                                    </TableCell>
                                                    <TableCell className="px-3 py-2 text-right text-sm font-medium text-emerald-600">
                                                        {formatCurrency(sale?.total || 0)}
                                                    </TableCell>
                                                    <TableCell className="px-3 py-2">
                                                        <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full border ${getStatusColor(sale?.status || '')}`}>
                                                            {sale?.status || 'UNKNOWN'}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className="px-3 py-2 text-sm text-gray-600">
                                                        <ClientDate dateString={sale?.createdAt || ''} />
                                                    </TableCell>
                                                    <TableCell className="px-2 py-2">
                                                        <Button variant="ghost" size="icon" className="h-6 w-6">
                                                            <Eye size={12} className="text-gray-400" />
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>

                                                {/* Expanded Items */}
                                                {sale?.id && expandedRows.has(sale.id) && sale.items && sale.items.length > 1 && (
                                                    <TableRow className="bg-gray-50">
                                                        <TableCell colSpan={9} className="p-0">
                                                            <div className="py-2 px-8 border-b border-gray-200">
                                                                {sale.items.slice(1).map((item, idx) => (
                                                                    <div key={idx} className="flex items-center justify-between py-1 text-xs">
                                                                        <span className="text-gray-600">{item?.medicine?.name}</span>
                                                                        <div className="flex items-center gap-4">
                                                                            <span className="text-gray-500">Qty: {item?.quantity}</span>
                                                                            <span className="text-gray-500">Price: {formatCurrency(item?.price || 0)}</span>
                                                                            <span className="font-medium text-emerald-600">
                                                                                {formatCurrency((item?.quantity || 0) * (item?.price || 0))}
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                )}
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

