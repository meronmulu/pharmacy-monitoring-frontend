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
import { UserPlus, Mail, Lock, User, Shield, ArrowLeft } from "lucide-react"
import Link from "next/link"

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
            if (user) router.push("/dashboard/user")
        } catch (error) {
            console.error("Registration failed:", error)
        } finally {
            setLoading(false)
        }
    }



    return (
        <div className="min-h-screen bg-[#F7F8FA] flex items-center justify-center p-6 relative">

            {/* Card */}
            <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">

                {/* Header */}
                <div className="px-10 pt-10 pb-8  border-gray-100">
                    

                    <h1 className="text-3xl font-bold text-gray-800">
                        Create New User
                    </h1>
                    <p className="text-gray-500 mt-2">
                        Add a new team member to the pharmacy management system
                    </p>
                </div>

                <form onSubmit={handleSubmit}>

                  
                    <div className="px-10 py-10 space-y-8">

                        {/* Name */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                <User size={16} className="text-emerald-500" />
                                Full Name
                            </label>
                            <div className="relative">
                                <Input
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    placeholder="Enter full name"
                                    className="pl-10 h-12 rounded-xl border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
                                />
                                <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            </div>
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                <Mail size={16} className="text-emerald-500" />
                                Email Address
                            </label>
                            <div className="relative">
                                <Input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    placeholder="user@example.com"
                                    className="pl-10 h-12 rounded-xl border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
                                />
                                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                <Lock size={16} className="text-emerald-500" />
                                Password
                            </label>
                            <div className="relative">
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    placeholder="••••••••"
                                    className="pl-10 pr-20 h-12 rounded-xl border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
                                />
                                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-emerald-600 hover:text-emerald-700"
                                >
                                    {showPassword ? "Hide" : "Show"}
                                </button>
                            </div>
                        </div>

                        {/* Role */}
                        {/* Role */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                <Shield size={16} className="text-emerald-500" />
                                User Role
                            </label>

                            <div className="relative">
                                <Select value={role} onValueChange={setRole}>
                                    <SelectTrigger className="pl-10 h-12 bg-white rounded-xl border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 w-full">
                                        <SelectValue placeholder="Select user role" />
                                    </SelectTrigger>

                                    <SelectContent className="bg-white">
                                        <SelectItem value="ADMIN">Admin</SelectItem>
                                        <SelectItem value="PHARMACIST">Pharmacist</SelectItem>
                                        <SelectItem value="CASHIER">Cashier</SelectItem>
                                    </SelectContent>
                                </Select>

                                {/* Left Icon */}
                                <Shield
                                    size={18}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                                />
                            </div>
                        </div>



                    </div>

                    {/* Footer */}
                    <div className="px-10 py-6 bg-gray-50 border-t border-gray-100">
                        <Button
                            type="submit"
                            disabled={loading || !name || !email || !password || !role}
                            className="w-full h-12 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-medium shadow-md"
                        >
                            {loading ? "Creating Account..." : "Create User Account"}
                        </Button>

                        <p className="text-xs text-center text-gray-400 mt-4">
                            Account access will depend on the selected role
                        </p>
                    </div>

                </form>
            </div>
        </div>
    )
}