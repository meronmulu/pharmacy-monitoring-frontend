'use client'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import NavBar from '@/components/NavBar'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    CardFooter
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    AlertCircle,
    Package,
    Search,
    Plus,
    MoreVertical,
    Edit,
    Trash2,
    Calendar,
    DollarSign,
    Archive,
    AlertTriangle,
    Loader2,
    Filter,
    ChevronDown,
    Pill,
    Clock,
    TrendingUp
} from "lucide-react"
import Link from "next/link"
import { getAllmedicines } from "@/service/medicineService"
import { Medicine } from "@/types"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

export default function Page() {
    const { user } = useAuth()
    const router = useRouter()

    const [medicines, setMedicines] = useState<Medicine[]>([])
    const [search, setSearch] = useState("")
    const [pageLoading, setPageLoading] = useState(false)
    const [filterStatus, setFilterStatus] = useState<"all" | "lowStock" | "expired" | "inStock">("all")

    useEffect(() => {
        if (user?.role !== "PHARMACIST") {
            router.replace("/")
        }
    }, [user, router])

    useEffect(() => {
        const fetchMedicines = async () => {
            try {
                setPageLoading(true)
                const data = await getAllmedicines()
                setMedicines(Array.isArray(data) ? data : [])
            } catch (error) {
                console.error("Failed to fetch medicines:", error)
                setMedicines([])
            } finally {
                setPageLoading(false)
            }
        }

        if (user?.role === "PHARMACIST") {
            fetchMedicines()
        }
    }, [user])

    const filteredMedicines = medicines.filter(m => {
        const matchesSearch = m.name.toLowerCase().includes(search.toLowerCase())
        
        switch(filterStatus) {
            case "lowStock":
                return matchesSearch && m.quantity <= 10
            case "expired":
                return matchesSearch && new Date(m.expiryDate) < new Date()
            case "inStock":
                return matchesSearch && m.quantity > 10 && new Date(m.expiryDate) >= new Date()
            default:
                return matchesSearch
        }
    })

    const stats = {
        total: medicines.length,
        lowStock: medicines.filter(m => m.quantity <= 10).length,
        expired: medicines.filter(m => new Date(m.expiryDate) < new Date()).length,
        inStock: medicines.filter(m => m.quantity > 10 && new Date(m.expiryDate) >= new Date()).length
    }

    const StatCard = ({ 
        title, 
        value, 
        icon: Icon, 
        color,
        onClick 
    }: { 
        title: string; 
        value: number; 
        icon: any; 
        color: string;
        onClick?: () => void;
    }) => (
        <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className={cn(
                "bg-white rounded-xl p-4 shadow-sm border border-gray-100 cursor-pointer transition-all",
                "hover:shadow-md hover:border-gray-200"
            )}
        >
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-500">{title}</p>
                    <p className="text-2xl font-bold mt-1">{value}</p>
                </div>
                <div className={cn("p-3 rounded-lg", color)}>
                    <Icon className="h-5 w-5 text-white" />
                </div>
            </div>
        </motion.div>
    )

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <NavBar />

            <div className="px-4 sm:px-6 lg:px-8 py-24 max-w-7xl mx-auto">
                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-8"
                >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                                Medicine Inventory
                            </h1>
                            <p className="text-gray-500 mt-2 flex items-center gap-2">
                                <Package className="h-4 w-4" />
                                Manage your pharmaceutical stock and pricing
                            </p>
                        </div>

                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Link href="/dashboard/medicine/create">
                                <Button className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg shadow-emerald-500/25">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Medicine
                                </Button>
                            </Link>
                        </motion.div>
                    </div>
                </motion.div>

                {/* Stats Cards */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
                >
                    <StatCard
                        title="Total Medicines"
                        value={stats.total}
                        icon={Pill}
                        color="bg-gradient-to-r from-blue-500 to-blue-600"
                        onClick={() => setFilterStatus("all")}
                    />
                    <StatCard
                        title="In Stock"
                        value={stats.inStock}
                        icon={Package}
                        color="bg-gradient-to-r from-emerald-500 to-emerald-600"
                        onClick={() => setFilterStatus("inStock")}
                    />
                    <StatCard
                        title="Low Stock"
                        value={stats.lowStock}
                        icon={AlertTriangle}
                        color="bg-gradient-to-r from-amber-500 to-amber-600"
                        onClick={() => setFilterStatus("lowStock")}
                    />
                    <StatCard
                        title="Expired"
                        value={stats.expired}
                        icon={AlertCircle}
                        color="bg-gradient-to-r from-red-500 to-red-600"
                        onClick={() => setFilterStatus("expired")}
                    />
                </motion.div>

                {/* Search and Filter Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="mb-8"
                >
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Search medicines by name..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-10 pr-4 py-2 w-full border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 rounded-xl"
                            />
                        </div>
                        
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="border-gray-200 hover:bg-gray-50 rounded-xl">
                                    <Filter className="h-4 w-4 mr-2" />
                                    {filterStatus === "all" && "All Medicines"}
                                    {filterStatus === "inStock" && "In Stock"}
                                    {filterStatus === "lowStock" && "Low Stock"}
                                    {filterStatus === "expired" && "Expired"}
                                    <ChevronDown className="h-4 w-4 ml-2" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => setFilterStatus("all")}>
                                    <Package className="h-4 w-4 mr-2" /> All Medicines
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setFilterStatus("inStock")}>
                                    <Package className="h-4 w-4 mr-2" /> In Stock
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setFilterStatus("lowStock")}>
                                    <AlertTriangle className="h-4 w-4 mr-2" /> Low Stock
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setFilterStatus("expired")}>
                                    <AlertCircle className="h-4 w-4 mr-2" /> Expired
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </motion.div>

                {/* Medicines Grid */}
                {pageLoading ? (
                    <div className="flex flex-col items-center justify-center h-64">
                        <Loader2 className="h-8 w-8 animate-spin text-emerald-500 mb-4" />
                        <p className="text-gray-500">Loading medicines...</p>
                    </div>
                ) : filteredMedicines.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm"
                    >
                        <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">No medicines found</h3>
                        <p className="text-gray-500 mb-6">
                            {search ? "Try adjusting your search" : "Start by adding your first medicine"}
                        </p>
                        {!search && (
                            <Link href="/dashboard/medicine/create">
                                <Button className="bg-emerald-500 hover:bg-emerald-600 text-white">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Medicine
                                </Button>
                            </Link>
                        )}
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        <AnimatePresence>
                            {filteredMedicines.map((medicine, index) => {
                                const isLowStock = medicine.quantity <= 10
                                const isExpired = new Date(medicine.expiryDate) < new Date()
                                const daysToExpiry = Math.ceil((new Date(medicine.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))

                                return (
                                    <motion.div
                                        key={medicine.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ duration: 0.3, delay: index * 0.05 }}
                                        whileHover={{ y: -4 }}
                                        className="group"
                                    >
                                        <Card className={cn(
                                            "relative overflow-hidden border-2 transition-all duration-300 h-full",
                                            isExpired 
                                                ? "border-red-200 hover:border-red-300 bg-gradient-to-br from-white to-red-50/30"
                                                : isLowStock
                                                ? "border-amber-200 hover:border-amber-300 bg-gradient-to-br from-white to-amber-50/30"
                                                : "border-gray-100 hover:border-emerald-200 bg-gradient-to-br from-white to-emerald-50/30",
                                            "hover:shadow-xl hover:shadow-emerald-500/5"
                                        )}>
                                            {/* Status Indicator */}
                                            <div className={cn(
                                                "absolute top-0 left-0 w-1 h-full",
                                                isExpired ? "bg-red-500" : isLowStock ? "bg-amber-500" : "bg-emerald-500"
                                            )} />

                                            <CardHeader className="pb-2">
                                                <div className="flex justify-between items-start">
                                                    <div className="flex-1">
                                                        <CardTitle className="text-xl font-bold text-gray-800 group-hover:text-emerald-600 transition-colors">
                                                            {medicine.name}
                                                        </CardTitle>
                                                        <CardDescription className="flex items-center gap-2 mt-1">
                                                            <Calendar className="h-3 w-3" />
                                                            Expires: {new Date(medicine.expiryDate).toLocaleDateString('en-US', {
                                                                year: 'numeric',
                                                                month: 'short',
                                                                day: 'numeric'
                                                            })}
                                                        </CardDescription>
                                                    </div>
                                                    
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                                                <MoreVertical className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem>
                                                                <Edit className="h-4 w-4 mr-2" /> Edit
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem className="text-red-600">
                                                                <Trash2 className="h-4 w-4 mr-2" /> Delete
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>
                                            </CardHeader>

                                            <CardContent>
                                                <div className="space-y-3">
                                                    {/* Stock and Price */}
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-2">
                                                            <Archive className="h-4 w-4 text-gray-400" />
                                                            <span className={cn(
                                                                "font-medium",
                                                                isLowStock ? "text-amber-600" : "text-gray-700"
                                                            )}>
                                                                {medicine.quantity} units
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <DollarSign className="h-4 w-4 text-emerald-500" />
                                                            <span className="font-bold text-emerald-600">
                                                                ${medicine.price.toFixed(2)}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Status Badges */}
                                                    <div className="flex flex-wrap gap-2">
                                                        {isLowStock && (
                                                            <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                                                                <AlertTriangle className="h-3 w-3 mr-1" />
                                                                Low Stock
                                                            </Badge>
                                                        )}
                                                        {isExpired && (
                                                            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                                                                <AlertCircle className="h-3 w-3 mr-1" />
                                                                Expired
                                                            </Badge>
                                                        )}
                                                        {!isExpired && daysToExpiry <= 30 && daysToExpiry > 0 && (
                                                            <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                                                                <Clock className="h-3 w-3 mr-1" />
                                                                Expires in {daysToExpiry} days
                                                            </Badge>
                                                        )}
                                                        {medicine.quantity > 50 && (
                                                            <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                                                                <TrendingUp className="h-3 w-3 mr-1" />
                                                                High Stock
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </div>
                                            </CardContent>

                                           
                                        </Card>
                                    </motion.div>
                                )
                            })}
                        </AnimatePresence>
                    </motion.div>
                )}
            </div>
        </div>
    )
}