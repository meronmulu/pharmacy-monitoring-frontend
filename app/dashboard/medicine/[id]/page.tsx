'use client'

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { getMedicineById, updateMedicine } from "@/service/medicineService"
import { getAllSuppliers } from "@/service/supplierService"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function UpdateMedicinePage() {
  const router = useRouter()
  const { id } = useParams()

  const [name, setName] = useState("")
  const [price, setPrice] = useState("")
  const [quantity, setQuantity] = useState("")
  const [expiryDate, setExpiryDate] = useState("")
  const [supplierId, setSupplierId] = useState("")
  const [suppliers, setSuppliers] = useState<{ id: number; name: string }[]>([])
  const [saving, setSaving] = useState(false)

  // Fetch suppliers
  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const data = await getAllSuppliers()
        setSuppliers(data)
      } catch (err) {
        console.error("Failed to fetch suppliers:", err)
      }
    }
    fetchSuppliers()
  }, [])

  // Fetch medicine
  useEffect(() => {
    const fetchMedicine = async () => {
      try {
        const data = await getMedicineById(Number(id))

        if (data) {
          setName(data.name)
          setPrice(data.price.toString())
          setQuantity(data.quantity.toString())
          setExpiryDate(data.expiryDate.split("T")[0])
          setSupplierId(data.supplierId.toString())
        }
      } catch (err) {
        console.error("Failed to fetch medicine:", err)
      }
    }
    fetchMedicine()
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      await updateMedicine(Number(id), {
        name,
        price: Number(price),
        quantity: Number(quantity),
        expiryDate: new Date(expiryDate).toISOString(),
        supplierId: Number(supplierId),
      })
      alert("Medicine updated successfully!")
      router.push("/dashboard/medicine")
    } catch (err) {
      console.error("Failed to update medicine:", err)
      alert("Failed to update medicine. Check console.")
    } finally {
      setSaving(false)
    }
  }


  return (
    <div className="min-h-screen bg-[#F7F8FA] flex justify-center items-start py-16 px-6">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg border border-gray-100">

        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-100">
          <h1 className="text-2xl font-semibold text-gray-800">
            Update Medicine
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Enter medicine details below to add it to inventory
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="px-8 py-8 space-y-6"
        >

          {/* Medicine Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Medicine Name
            </label>
            <input
              type="text"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full h-11 rounded-lg border border-gray-200 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-500  transition"
              placeholder="Enter medicine name"
            />
          </div>

          {/* Price + Quantity Grid */}
          <div className="grid md:grid-cols-2 gap-6">

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Price (ETB)
              </label>
              <input
                type="number"
                name="price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                className="w-full h-11 rounded-lg border border-gray-200 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-500  transition"
                placeholder="0.00"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Quantity
              </label>
              <input
                type="number"
                name="quantity"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
                className="w-full h-11 rounded-lg border border-gray-200 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-500  transition"
                placeholder="Enter quantity"
              />
            </div>

          </div>

          {/* Expiry + Supplier Grid */}
          <div className="grid md:grid-cols-2 gap-6">

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Expiry Date
              </label>
              <input
                type="date"
                name="expiryDate"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                required
                className="w-full h-11 rounded-lg border border-gray-200 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-500  transition"
              />
            </div>



            <div className="space-y-2">
              <label className="text-sm font-medium">Supplier</label>

              <Select
                value={supplierId}
                onValueChange={(value) => setSupplierId(value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Supplier" />
                </SelectTrigger>

                <SelectContent>
                  {suppliers.map((s) => (
                    <SelectItem key={s.id} value={s.id.toString()}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              className="w-full h-11 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium transition shadow-md"
            >
              update Medicine
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}



