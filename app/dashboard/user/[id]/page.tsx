'use client'

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { getUserById, updateUser } from "@/service/userService"

import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function EditUserPage() {
  const { id } = useParams()
  const router = useRouter()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [role, setRole] = useState("")
  const [saving, setSaving] = useState(false)

  // Fetch user by ID
  useEffect(() => {
    const fetchUser = async () => {
      const user = await getUserById(id as unknown as number)

      if (user) {
        setName(user.name)
        setEmail(user.email)
        setRole(user.role)
      }

    }

    if (id) fetchUser()
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    const updated = await updateUser(id as unknown as number, {
      name,
      email,
      role,
    })

    if (updated) {
      router.push("/dashboard/user")
    }

    setSaving(false)
  }

 

  return (
    <div className="flex min-h-screen p-4 items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-md">
        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <FieldSet>
              <FieldLegend className="text-6xl text-center font-bold">Update User</FieldLegend>
              <FieldDescription className="text-center">
                Update user account information
              </FieldDescription>

              <FieldGroup className="space-y-4 pt-4">
                <Field>
                  <FieldLabel>Full Name</FieldLabel>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </Field>

                <Field>
                  <FieldLabel>Email Address</FieldLabel>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </Field>

                <Field>
                  <FieldLabel>User Role</FieldLabel>
                  <Select value={role} onValueChange={setRole}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select user role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ADMIN">ADMIN</SelectItem>
                      <SelectItem value="CASHIER">CASHIER</SelectItem>
                      <SelectItem value="PHARMACIST">PHARMACIST</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
              </FieldGroup>
            </FieldSet>

            <Field orientation="horizontal" className="pt-4">
              <Button
                type="submit"
                disabled={saving}
                className="w-full text-white bg-emerald-500 hover:bg-emerald-600"
              >
                {saving ? "Updating..." : "Update User"}
              </Button>
            </Field>
          </FieldGroup>
        </form>
      </div>
    </div>
  )
}
