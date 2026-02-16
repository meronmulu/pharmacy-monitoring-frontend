
'use client'

import { useEffect, useState } from "react"
import { Medicine, User } from "@/types"

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
import { deleteMedicine, getAllmedicines } from "@/service/medicineService"

export default function Page() {
    const [medicines, setMedicines] = useState<Medicine[]>([])
    const [deletingId, setDeletingId] = useState<number | null>(null)

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await getAllmedicines()
                setMedicines(data)
            } catch (error) {
                console.error("Fetch users error:", error)
            } 
        }

        fetchUsers()
    }, [])

    const handleDelete = async (id: number) => {
        try {
            setDeletingId(id)

            await deleteMedicine(id)

            setMedicines((prev) => prev.filter((user) => user.id !== id))
        } catch (error) {
            console.error("Delete failed:", error)
        } finally {
            setDeletingId(null)
        }
    }

   

    return (
        <div className="p-6 bg-white rounded-xl shadow-sm">
            <div className="border rounded-lg overflow-hidden">
                <Table>
                    <TableHeader className="bg-gray-100">
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>price</TableHead>
                            <TableHead>quantity</TableHead>
                            <TableHead>expiryDate</TableHead>
                            <TableHead>supplier</TableHead>
                            <TableHead className="text-right  pr-14 ">Actions</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody className="pl-4">
                        {medicines.map((medicine) => (
                            <TableRow
                                key={medicine.id}
                                className="hover:bg-gray-50 transition"
                            >
                                <TableCell className="font-medium text-gray-700">
                                    {medicine.name}
                                </TableCell>

                                <TableCell>{medicine.price}</TableCell>
                                <TableCell>{medicine.quantity}</TableCell>
                                <TableCell>
                                    {new Date(medicine.expiryDate).toLocaleDateString("en-GB")}
                                </TableCell>
                                <TableCell>{medicine.supplier?.name}</TableCell>



                                <TableCell className="text-right pr-10 space-x-2">

                                    {/* Edit */}
                                    <Link href={`/dashboard/medicine/${medicine.id}`}>
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
                                                        {medicine.name}
                                                    </span>.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>

                                            <AlertDialogFooter className="flex justify-center gap-4 sm:justify-center">
                                                <AlertDialogCancel>
                                                    Cancel
                                                </AlertDialogCancel>

                                                <AlertDialogAction
                                                    onClick={() => handleDelete(medicine.id)}
                                                    className="bg-red-600 hover:bg-red-700"
                                                >
                                                    {deletingId === medicine.id ? (
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
