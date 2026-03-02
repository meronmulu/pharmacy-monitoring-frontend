'use client'

import React, { useEffect, useState } from "react"
import { Sale, User } from "@/types"
import { getAllSales } from "@/service/saleService"
import { getAllUsers } from "@/service/userService"
import { DollarSign, Package, Users, FileText, Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'
import { Bar } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export default function AdminDashboard() {

  const [sales, setSales] = useState<Sale[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [topMedicines, setTopMedicines] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)

      const salesData = await getAllSales()
      const usersData = await getAllUsers()

      setSales(salesData || [])
      setUsers(usersData || [])

      calculateTopMedicines(salesData || [])

    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  // ================= TOP MEDICINES =================
  const calculateTopMedicines = (salesData: Sale[]) => {
    const medicineMap: Record<string, number> = {}

    salesData.forEach((sale) => {
      sale.items?.forEach((item) => {
        const name = item.medicine?.name
        if (!name) return

        medicineMap[name] = (medicineMap[name] || 0) + (item.quantity || 0)
      })
    })

    const sorted = Object.entries(medicineMap)
      .map(([name, quantitySold]) => ({ name, quantitySold }))
      .sort((a, b) => b.quantitySold - a.quantitySold)
      .slice(0, 5)

    setTopMedicines(sorted)
  }

  // ================= DASHBOARD STATS =================

  const todayRevenue = sales
    .filter(s => new Date(s.createdAt).toDateString() === new Date().toDateString())
    .reduce((sum, s) => sum + (s.total || 0), 0)

  const totalSales = sales.length

  const totalStaff = users.filter(
    user => user.role?.toUpperCase() === "STAFF"
  ).length

  const totalMedicines = new Set(
    sales.flatMap(s => s.items?.map(i => i.medicine?.id))
  ).size

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-US').format(amount)

  // ================= SALES TREND =================

  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    return d
  })

  const chartLabels = last7Days.map(d =>
    d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  )

  const chartDataValues = last7Days.map(day =>
    sales
      .filter(s => new Date(s.createdAt).toDateString() === day.toDateString())
      .reduce((sum, s) => sum + (s.total || 0), 0)
  )

  const barChartData = {
    labels: chartLabels,
    datasets: [
      {
        label: 'Daily Revenue',
        data: chartDataValues,
        backgroundColor: 'rgba(16, 185, 129, 0.6)',
      },
    ],
  }

  const getStatusVariant = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'COMPLETED': return 'success'
      case 'PENDING': return 'warning'
      case 'CANCELLED': return 'destructive'
      default: return 'secondary'
    }
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen space-y-6">

      {/* ================= CARDS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        <Card>
          <CardHeader className="flex items-center gap-2">
            <DollarSign className="text-emerald-500" />
            <CardTitle>Today Revenue</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            ETB {formatCurrency(todayRevenue)}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex items-center gap-2">
            <FileText className="text-blue-500" />
            <CardTitle>Total Sales</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            {totalSales}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex items-center gap-2">
            <Package className="text-purple-500" />
            <CardTitle>Total Medicines</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            {totalMedicines}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex items-center gap-2">
            <Users className="text-pink-500" />
            <CardTitle>Total Staff</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            {totalStaff}
          </CardContent>
        </Card>

      </div>

      {/* ================= RECENT SALES + TOP MEDICINES ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Recent Sales */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[350px] pr-4">
              {loading ? (
                <div className="flex justify-center items-center h-40">
                  <Loader2 className="animate-spin text-emerald-500 h-8 w-8" />
                </div>
              ) : (
                sales.slice(0, 10).map((sale) => (
                  <div key={sale.id} className="flex justify-between p-3 mb-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{sale.cashier?.name || "Unknown"}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(sale.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">
                        ETB {formatCurrency(sale.total || 0)}
                      </p>
                      <Badge variant={getStatusVariant(sale.status || '')}>
                        {sale.status}
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Top Medicines */}
        <Card>
          <CardHeader>
            <CardTitle>Top Selling Medicines</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[350px] pr-4">
              {topMedicines.map((med, index) => (
                <div key={index} className="flex justify-between p-3 mb-3 bg-gray-50 rounded-lg">
                  <span>{med.name}</span>
                  <span className="font-bold">{med.quantitySold} sold</span>
                </div>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>

      </div>

      {/* ================= SALES TREND ================= */}
      <Card>
        <CardHeader>
          <CardTitle>Sales Trend (Last 7 Days)</CardTitle>
        </CardHeader>
        <CardContent>
          <Bar data={barChartData} />
        </CardContent>
      </Card>

    </div>
  )
}