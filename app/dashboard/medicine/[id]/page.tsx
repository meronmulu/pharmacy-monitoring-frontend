'use client'

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { getMedicineById, updateMedicine } from "@/service/medicineService"
import { getAllSuppliers } from "@/service/supplierService"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function UpdateMedicinePage() {
  const router = useRouter()
  const { id } = useParams()

  const [name, setName] = useState("")
  const [price, setPrice] = useState("")
  const [quantity, setQuantity] = useState("")
  const [expiryDate, setExpiryDate] = useState("")
  const [supplierId, setSupplierId] = useState("")
  const [suppliers, setSuppliers] = useState<{ id: number; name: string }[]>([])

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

    try {
      await updateMedicine(Number(id), {
        name,
        price: Number(price),
        quantity: Number(quantity),
        expiryDate: new Date(expiryDate).toISOString(),
        supplierId: Number(supplierId),
      })
      toast.success("Medicine updated successfully!")
      router.push("/dashboard/medicine")
    } catch (err) {
      console.error("Failed to update medicine:", err)
      toast.error("Failed to update medicine. Check console.")
    } 
  }


  return (
    <div className="p-6 bg-[#F7F8FA]">
  <div className="max-w-3xl mx-auto">
    <div className="bg-white rounded-2xl shadow-sm border p-8">

      <form onSubmit={handleSubmit}>
        <FieldGroup>
          <FieldSet>

            <FieldLegend>
              <p className="text-2xl font-bold">Update Medicine</p>
            </FieldLegend>

            <FieldDescription>
              Modify the medicine details below
            </FieldDescription>

            <FieldGroup className="">

              {/* Medicine Name */}
              <Field>
                <FieldLabel>Medicine Name</FieldLabel>
                <Input
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Enter medicine name"
                />
              </Field>

              {/* Price + Quantity */}
              <div className="grid md:grid-cols-2 gap-6">

                <Field>
                  <FieldLabel>Price (ETB)</FieldLabel>
                  <Input
                    type="number"
                    name="price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                    placeholder="0.00"
                  />
                </Field>

                <Field>
                  <FieldLabel>Quantity</FieldLabel>
                  <Input
                    type="number"
                    name="quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    required
                    placeholder="Enter quantity"
                  />
                </Field>

              </div>

              {/* Expiry + Supplier */}
              <div className="grid md:grid-cols-2 gap-6">

                <Field>
                  <FieldLabel>Expiry Date</FieldLabel>
                  <Input
                    type="date"
                    name="expiryDate"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    required
                  />
                </Field>

                <Field>
                  <FieldLabel>Supplier</FieldLabel>
                  <Select
                    value={supplierId}
                    onValueChange={(value) => setSupplierId(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Supplier" />
                    </SelectTrigger>

                    <SelectContent className="bg-white">
                      {suppliers.map((s) => (
                        <SelectItem
                          key={s.id}
                          value={s.id.toString()}
                        >
                          {s.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>

              </div>

            </FieldGroup>

          </FieldSet>

          {/* Submit Button */}
          <Field orientation="horizontal" className="pt-6">
            <Button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              Update Medicine
            </Button>
          </Field>

        </FieldGroup>
      </form>

    </div>
  </div>
</div>
  )
}



