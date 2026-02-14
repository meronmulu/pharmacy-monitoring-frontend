'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { register } from "@/service/userService"
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

export default function RegisterPage() {
  const router = useRouter()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const user = await register({
      name,
      email,
      password,
      role,
    })

    if (user) {
      // ✅ Redirect to users page
      router.push("dashboard/user")  // change path if needed
    }

    setLoading(false)
  }

  return (
    <div className="flex min-h-screen px-6 items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-md">
        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <FieldSet>
              <FieldLegend>User Registration</FieldLegend>
              <FieldDescription>
                Create a new system user account
              </FieldDescription>

              <FieldGroup className="space-y-4 pt-4">
                <Field>
                  <FieldLabel>Full Name</FieldLabel>
                  <Input value={name} onChange={(e) => setName(e.target.value)} required />
                </Field>

                <Field>
                  <FieldLabel>Email Address</FieldLabel>
                  <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </Field>

                <Field>
                  <FieldLabel>Password</FieldLabel>
                  <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
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
                disabled={loading}
                className="w-full bg-emerald-500 hover:bg-emerald-600"
              >
                {loading ? "Registering..." : "Register User"}
              </Button>
            </Field>
          </FieldGroup>
        </form>
      </div>
    </div>
  )
}
