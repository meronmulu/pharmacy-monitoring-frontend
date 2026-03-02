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
        } catch (error: any) {
            console.error("Registration failed:", error)

            toast.error(
                error?.response?.data?.message || "Registration failed"
            )
        } finally {
            setLoading(false)
        }
    }



    return (
        <div className="h-screen flex items-center justify-center">
            <div className="w-full max-w-md sm:max-w-lg lg:max-w-2xl bg-white rounded-3xl shadow-sm border overflow-hidden">

                {/* Header */}
                <div className="p-6 sm:p-8 border-b border-gray-100">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                        Create New User
                    </h1>
                    <p className="text-gray-500 mt-2 text-sm sm:text-base">
                        Add a new team member to the pharmacy management system
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="px-6 sm:px-8 space-y-5 sm:space-y-6 py-6">

                        {/* Name */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">
                                Full Name
                            </label>
                            <div className="relative">
                                <Input
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    placeholder="Enter full name"
                                    className="pl-10 h-11 rounded-xl border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
                                />
                                <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            </div>
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">
                                Email Address
                            </label>
                            <div className="relative">
                                <Input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    placeholder="user@example.com"
                                    className="pl-10 h-11 rounded-xl border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
                                />
                                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">
                                Password
                            </label>

                            <div className="relative">
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    placeholder="Enter your password"
                                    className="pl-10 pr-12 h-11 rounded-xl border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
                                />

                                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

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
                        </div>

                        {/* Role */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">
                                User Role
                            </label>

                            <Select value={role} onValueChange={setRole}>
                                <SelectTrigger className="h-11 rounded-xl border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 w-full">
                                    <SelectValue placeholder="Select user role" />
                                </SelectTrigger>

                                <SelectContent>
                                    <SelectItem value="ADMIN">Admin</SelectItem>
                                    <SelectItem value="PHARMACIST">Pharmacist</SelectItem>
                                    <SelectItem value="CASHIER">Cashier</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                    </div>

                    {/* Footer */}
                    <div className="px-6 sm:px-8 py-6 bg-gray-50 border-t border-gray-100">
                        <Button
                            type="submit"
                            className="w-full h-12 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-medium shadow-md"
                        >
                            {loading ? "Creating Account..." : "Create User Account"}
                        </Button>
                    </div>

                </form>
            </div>
        </div>
    )

}