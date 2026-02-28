'use client'

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { getSupplierById, updateSupplier } from "@/service/supplierService"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function UpdateSupplierPage() {
  const router = useRouter()
  const { id } = useParams()

  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [address, setAddress] = useState("")
  const [saving, setSaving] = useState(false)

  

  // Fetch medicine
  useEffect(() => {
    const fetchSupplier = async () => {
      try {
        const data = await getSupplierById(Number(id))

        if (data) {
          setName(data.name ?? "")
          setPhone(data.phone ?? "")
          setEmail(data.email ?? "")
          setAddress(data.address ?? "")
        }
      } catch (err) {
        console.error("Failed to fetch supplier:", err)
      }
    }
    fetchSupplier()
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      await updateSupplier(Number(id), {
        name,
        phone: phone,
        email: email,
        address: address
        
      })
      alert("Supplier updated successfully!")
      router.push("/dashboard/supplier")
    } catch (err) {
      console.error("Failed to update supplier:", err)
      alert("Failed to update supplier. Check console.")
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
            Update Supplier
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Enter supplier details below to update it in inventory
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="px-8 py-8 space-y-6"
        >

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Supplier Name
            </label>
            <input
              type="text"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full h-11 rounded-lg border border-gray-200 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-500  transition"
              placeholder="Enter supplier name"
            />
          </div>


            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Phone
              </label>
              <input
                type="number"
                name="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="w-full h-11 rounded-lg border border-gray-200 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-500  transition"
                placeholder="0.00"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full h-11 rounded-lg border border-gray-200 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-500  transition"
                placeholder="Enter email"
              />
            </div>



            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Address
              </label>
              <input
                type="text"
                name="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                className="w-full h-11 rounded-lg border border-gray-200 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-500  transition"
              />
            </div>



            


          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              className="w-full h-11 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium transition shadow-md"
            >
              update Supplier
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}



