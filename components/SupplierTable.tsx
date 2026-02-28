'use client'

import { useEffect, useState } from "react"
import { Supplier} from "@/types"

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

import { Pencil, Trash2, Loader2 } from "lucide-react"
import Link from "next/link"
import { deleteSupplier, getAllSuppliers } from "@/service/supplierService"

export default function Page() {
    const [suppliers, setSuppliers] = useState<Supplier[]>([])
    const [loading, setLoading] = useState(true)
    const [deletingId, setDeletingId] = useState<number | null>(null)

    useEffect(() => {
        const fetchSuppliers = async () => {
            try {
                const data = await getAllSuppliers()
                setSuppliers(data)
                console.log(data)
            } catch (error) {
                console.error("Fetch suppliers error:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchSuppliers()
    }, [])

    const handleDelete = async (id: number) => {
        try {
            setDeletingId(id)

            await deleteSupplier(id)

            // remove user from UI
            setSuppliers((prev) => prev.filter((user) => user.id !== id))
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
                            <TableHead>Phone</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Address</TableHead>
                            <TableHead className="text-right  pr-14 ">Actions</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody className="pl-4">
                        {suppliers.map((supplier) => (
                            <TableRow
                                key={supplier.id}
                                className="hover:bg-gray-50 transition"
                            >
                                <TableCell className="font-medium text-gray-700">
                                    {supplier.name}
                                </TableCell>

                                <TableCell>{supplier.phone}</TableCell>

                                <TableCell>{supplier.email}</TableCell>

                                <TableCell>{supplier.address}</TableCell>

                                <TableCell className="text-right pr-10 space-x-2">

                                    {/* Edit */}
                                    <Link href={`/dashboard/supplier/${supplier.id}`}>
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
                                                        {supplier.name}
                                                    </span>.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>

                                            <AlertDialogFooter className="flex justify-center gap-4 sm:justify-center">
                                                <AlertDialogCancel>
                                                    Cancel
                                                </AlertDialogCancel>

                                                <AlertDialogAction
                                                    onClick={() => handleDelete(supplier.id)}
                                                    className="bg-red-600 hover:bg-red-700"
                                                >
                                                    {deletingId === supplier.id ? (
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
