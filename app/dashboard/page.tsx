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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export default function AdminDashboard() {

  const [sales, setSales] = useState<Sale[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [topMedicines, setTopMedicines] = useState<{ name: string; quantitySold: number }[]>([])
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

  const totalStaff = users.length

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



  return (
    <div className="p-6 bg-gray-50 min-h-screen space-y-6">

      {/* ================= CARDS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        <Card className="bg-white">
          <CardHeader className="flex items-center gap-2">
            <DollarSign className="text-emerald-500" />
            <CardTitle>Today Revenue</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            ETB {formatCurrency(todayRevenue)}
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardHeader className="flex items-center gap-2">
            <FileText className="text-blue-500" />
            <CardTitle>Total Sales</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            {totalSales}
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardHeader className="flex items-center gap-2">
            <Package className="text-purple-500" />
            <CardTitle>Total Medicines</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            {totalMedicines}
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardHeader className="flex items-center gap-2">
            <Users className="text-pink-500" />
            <CardTitle>Total User</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            {totalStaff}
          </CardContent>
        </Card>

      </div>

      {/* ================= RECENT SALES + TOP MEDICINES ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Top Medicines */}
        <Card className="bg-white">
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
        <Card className="bg-white">
          <CardHeader>
            <CardTitle>Sales Trend (Last 7 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <Bar data={barChartData} />
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white">
        <CardHeader>
          <CardTitle>Recent Sales</CardTitle>
        </CardHeader>
        <CardContent>
          <Card>
            <CardContent>
              <ScrollArea className="h-64">
                {loading ? (
                  <div className="flex justify-center py-10">
                    <Loader2 className="animate-spin text-emerald-500 h-6 w-6" />
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Cashier</TableHead>
                        <TableHead>Medicine</TableHead>
                        <TableHead>Qty</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sales
                        .slice(-5) // takes the last 5 sales
                        .reverse() // optional: to show newest first
                        .map((sale) => (
                          <TableRow key={sale.id}>
                            <TableCell>{sale.cashier?.name}</TableCell>
                            <TableCell>
                              {sale.items?.map((i) => i.medicine?.name).join(', ')}
                            </TableCell>
                            <TableCell>
                              {sale.items?.reduce((sum, i) => sum + (i.quantity || 0), 0)}
                            </TableCell>
                            <TableCell>
                              {formatCurrency(
                                sale.items?.reduce((sum, i) => sum + (i.price || 0), 0) || 0
                              )}
                            </TableCell>
                            <TableCell>{formatCurrency(sale.total || 0)}</TableCell>
                            <TableCell>
                              <Badge>{sale.status}</Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </CardContent>
      </Card>

    </div>
  )
}