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
import { toast } from "sonner"

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

    try {
      const updated = await updateUser(Number(id), {
        name,
        email,
        role,
      })

      if (updated) {
        toast.success("User updated successfully ", {
          position: "top-center",
        })

        router.push("/dashboard/user")

      } else {
        toast.error("Failed to update user", {
          position: "top-center",
        })
      }
    } catch {
      toast.error("Failed to update user. Check console.")
    } finally {
      setSaving(false)
    }
  }



  return (
    <div className=" bg-[#F7F8FA]">
      <div className="max-w-2xl  mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border p-8">
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <FieldSet>
                <FieldLegend className=" text-center font-bold">
                  <p className="text-2xl  font-bold">Update User</p>
                </FieldLegend>
                <FieldDescription className="text-center">
                  Update user account information
                </FieldDescription>

                <FieldGroup className="">
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
                      <SelectContent className="bg-white">
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
      </div>
      )
}
