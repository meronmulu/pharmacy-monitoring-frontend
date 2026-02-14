'use client'

import { useEffect, useState } from "react"
import { getAllUsers, deleteUser } from "../service/userService"
import { User } from "@/types"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import { Button } from "@/components/ui/button"

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import { Eye, Pencil, Trash2, Loader2 } from "lucide-react"
import Link from "next/link"

export default function Page() {
    const [users, setUsers] = useState<User[]>([])
    const [loading, setLoading] = useState(true)
    const [deletingId, setDeletingId] = useState<number | null>(null)

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await getAllUsers()
                setUsers(data)
            } catch (error) {
                console.error("Fetch users error:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchUsers()
    }, [])

    const handleDelete = async (id: number) => {
        try {
            setDeletingId(id)

            await deleteUser(id)

            // remove user from UI
            setUsers((prev) => prev.filter((user) => user.id !== id))
        } catch (error) {
            console.error("Delete failed:", error)
        } finally {
            setDeletingId(null)
        }
    }

    if (loading) {
        return <div className="p-6">Loading users...</div>
    }

    return (
        <div className="p-6 bg-white rounded-xl shadow-sm">
            <div className="border rounded-lg overflow-hidden">
                <Table>
                    <TableHeader className="bg-gray-100">
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead className="text-right  pr-14 ">Actions</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody className="pl-4">
                        {users.map((user) => (
                            <TableRow
                                key={user.id}
                                className="hover:bg-gray-50 transition"
                            >
                                <TableCell className="font-medium text-gray-700">
                                    {user.name}
                                </TableCell>

                                <TableCell>{user.email}</TableCell>

                                <TableCell>
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-semibold
                      ${user.role === "ADMIN"
                                                ? "bg-purple-100 text-purple-700"
                                                : user.role === "CASHER"
                                                    ? "bg-blue-100 text-blue-700"
                                                    : "bg-green-100 text-green-700"
                                            }`}
                                    >
                                        {user.role}
                                    </span>
                                </TableCell>

                                <TableCell className="text-right pr-10 space-x-2">

                                    {/* Edit */}
                                    <Link href={`/dashboard/user/${user.id}`}>
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            className="text-yellow-600 hover:bg-yellow-100"
                                        >
                                            <Pencil size={18} />
                                        </Button>
                                    </Link>

                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="text-red-600 hover:bg-red-100"
                                            >
                                                <Trash2 size={18} />
                                            </Button>
                                        </AlertDialogTrigger>

                                        <AlertDialogContent className="bg-white  ">
                                            <AlertDialogHeader>
                                                <AlertDialogTitle className="text-center">
                                                    Delete User
                                                </AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    This action cannot be undone. This will permanently
                                                    delete{" "}
                                                    <span className="font-semibold">
                                                        {user.name}
                                                    </span>.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>

                                            <AlertDialogFooter className="flex justify-center gap-4 sm:justify-center">
                                                <AlertDialogCancel>
                                                    Cancel
                                                </AlertDialogCancel>

                                                <AlertDialogAction
                                                    onClick={() => handleDelete(user.id)}
                                                    className="bg-red-600 hover:bg-red-700"
                                                >
                                                    {deletingId === user.id ? (
                                                        <Loader2 className="h-4 w-4 animate-spin" />
                                                    ) : (
                                                        "Delete"
                                                    )}
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
