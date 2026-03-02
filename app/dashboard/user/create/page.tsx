'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { register } from "@/service/userService"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Mail, Lock, User, Shield, EyeOff, Eye } from "lucide-react"
import { toast } from "sonner"
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field"

export default function RegisterPage() {
    const router = useRouter()

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [role, setRole] = useState("")
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const user = await register({ name, email, password, role })

            if (user) {
                toast.success("User registered successfully ")


                router.push("/dashboard/user")
            }
        } catch (error) {
            console.error("Registration failed:", error)

            toast.error("Failed to register user. Check console.")
        } finally {
            setLoading(false)
        }
    }



    return (
        <div className=" bg-[#F7F8FA]">
            <div className="max-w-2xl  mx-auto">
                <div className="bg-white rounded-2xl shadow-sm border p-8">
                    <form onSubmit={handleSubmit}>
                        <FieldGroup>
                            <FieldSet>

                                {/* Header */}
                                <div className=" border-gray-100">
                                    <FieldLegend>
                                        <p className="text-2xl sm:text-3xl font-bold text-gray-800">
                                            Create New User
                                        </p>
                                    </FieldLegend>

                                    <FieldDescription className="mt-2 text-sm sm:text-base">
                                        Add a new team member to the pharmacy management system
                                    </FieldDescription>
                                </div>

                               

                                    {/* Full Name */}
                                    <Field>
                                        <FieldLabel>Full Name</FieldLabel>
                                        <div className="relative">
                                            <Input
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                required
                                                placeholder="Enter full name"
                                                className="pl-10 h-11 rounded-xl"
                                            />
                                            <User
                                                size={18}
                                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                            />
                                        </div>
                                    </Field>

                                    {/* Email */}
                                    <Field>
                                        <FieldLabel>Email Address</FieldLabel>
                                        <div className="relative">
                                            <Input
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                                placeholder="user@example.com"
                                                className="pl-10 h-11 rounded-xl"
                                            />
                                            <Mail
                                                size={18}
                                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                            />
                                        </div>
                                    </Field>

                                    {/* Password */}
                                    <Field>
                                        <FieldLabel>Password</FieldLabel>
                                        <div className="relative">
                                            <Input
                                                type={showPassword ? "text" : "password"}
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                required
                                                placeholder="Enter your password"
                                                className="pl-10 pr-12 h-11 rounded-xl"
                                            />

                                            <Lock
                                                size={18}
                                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                            />

                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-emerald-600 transition"
                                            >
                                                {showPassword ? (
                                                    <EyeOff className="w-5 h-5" />
                                                ) : (
                                                    <Eye className="w-5 h-5" />
                                                )}
                                            </button>
                                        </div>
                                    </Field>

                                    {/* Role */}
                                    <Field>
                                        <FieldLabel>User Role</FieldLabel>
                                        <Select value={role} onValueChange={setRole}>
                                            <SelectTrigger className="h-11 rounded-xl w-full">
                                                <SelectValue placeholder="Select user role" />
                                            </SelectTrigger>

                                            <SelectContent className="bg-white">
                                                <SelectItem value="ADMIN">Admin</SelectItem>
                                                <SelectItem value="PHARMACIST">Pharmacist</SelectItem>
                                                <SelectItem value="CASHIER">Cashier</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </Field>


                            </FieldSet>

                            {/* Footer */}
                            <div className="px-6 sm:px-8 py-6 bg-gray-50 border-t border-gray-100">
                                <Button
                                    type="submit"
                                    className="w-full h-12 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-medium shadow-md"
                                >
                                    {loading ? "Creating Account..." : "Create User Account"}
                                </Button>
                            </div>

                        </FieldGroup>
                    </form>
                  </div>
                </div>
            </div>
            )

}