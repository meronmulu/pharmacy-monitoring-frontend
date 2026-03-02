'use client'

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { getSupplierById, updateSupplier } from "@/service/supplierService"
import { toast } from "sonner"
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function UpdateSupplierPage() {
  const router = useRouter()
  const { id } = useParams()

  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [address, setAddress] = useState("")

  

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

    try {
      await updateSupplier(Number(id), {
        name,
        phone: phone,
        email: email,
        address: address
        
      })
      toast.success("Supplier updated successfully!")
      router.push("/dashboard/supplier")
    } catch (err) {
      console.error("Failed to update supplier:", err)
      toast.error("Failed to update supplier. Check console.")
    } 
  }


  return (
   <div className="bg-[#F7F8FA]">
  <div className="max-w-2xl mx-auto">
    <div className="bg-white rounded-2xl shadow-sm border p-8">

      <form onSubmit={handleSubmit}>
        <FieldGroup>
          <FieldSet>
            <FieldLegend>
              <p className="text-2xl font-bold">Update Supplier</p>
            </FieldLegend>

            <FieldDescription>
              Enter supplier details below to update it in inventory
            </FieldDescription>

            <FieldGroup className="">

              {/* Supplier Name */}
              <Field>
                <FieldLabel>Supplier Name</FieldLabel>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Enter supplier name"
                />
              </Field>

              {/* Phone */}
              <Field>
                <FieldLabel>Phone</FieldLabel>
                <Input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  placeholder="Enter phone number"
                />
              </Field>

              {/* Email */}
              <Field>
                <FieldLabel>Email</FieldLabel>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Enter email"
                />
              </Field>

              {/* Address */}
              <Field>
                <FieldLabel>Address</FieldLabel>
                <Input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                  placeholder="Enter address"
                />
              </Field>

            </FieldGroup>
          </FieldSet>

          <Field orientation="horizontal" className="pt-6">
            <Button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              Update Supplier
            </Button>
          </Field>
        </FieldGroup>
      </form>

    </div>
  </div>
</div>
  )
}



