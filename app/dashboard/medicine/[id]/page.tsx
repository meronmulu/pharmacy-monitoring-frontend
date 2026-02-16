'use client'

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { getMedicineById, updateMedicine } from "@/service/medicineService"
import { getAllSuppliers } from "@/service/supplierService"

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
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Update Medicine</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded-lg space-y-4">
        <div>
          <label>Medicine Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border p-2 rounded-md"
          />
        </div>

        <div>
          <label>Price</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full border p-2 rounded-md"
          />
        </div>

        <div>
          <label>Quantity</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="w-full border p-2 rounded-md"
          />
        </div>

        <div>
          <label>Expiry Date</label>
          <input
            type="date"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
            className="w-full border p-2 rounded-md"
          />
        </div>

        <div>
          <label>Supplier</label>
          <select
            value={supplierId}
            onChange={(e) => setSupplierId(e.target.value)}
            className="w-full border p-2 rounded-md"
          >
            <option value="">Select Supplier</option>
            {suppliers.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
        >
          {saving ? "Updating..." : "Update Medicine"}
        </button>
      </form>
    </div>
  )
}
