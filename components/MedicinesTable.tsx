'use client'

import { useEffect, useState } from "react"
import { Medicine } from "@/types"

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

import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"

import { Pencil, Trash2, Loader2 } from "lucide-react"
import Link from "next/link"
import { deleteMedicine, getAllmedicines } from "@/service/medicineService"

export default function Page() {
    const [medicines, setMedicines] = useState<Medicine[]>([])
    const [deletingId, setDeletingId] = useState<number | null>(null)

    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 5

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
            setMedicines((prev) => prev.filter((m) => m.id !== id))
        } catch (error) {
            console.error("Delete failed:", error)
        } finally {
            setDeletingId(null)
        }
    }

    // pagination logic
    const totalPages = Math.ceil(medicines.length / itemsPerPage)

    const paginatedMedicines = medicines.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    )

    return (
        <div className="p-6 bg-white rounded-xl shadow-sm">

            <div className="border rounded-lg overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Quantity</TableHead>
                            <TableHead>Expiry Date</TableHead>
                            <TableHead>Supplier</TableHead>
                            <TableHead className="text-right pr-14">
                                Actions
                            </TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {paginatedMedicines.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={6}
                                    className="text-center py-10 text-gray-500"
                                >
                                    No medicines found
                                </TableCell>
                            </TableRow>
                        ) : (
                            paginatedMedicines.map((medicine) => (
                                <TableRow key={medicine.id}>
                                    <TableCell className="font-medium">
                                        {medicine.name}
                                    </TableCell>

                                    <TableCell>{medicine.price} ETB</TableCell>
                                    <TableCell>{medicine.quantity}</TableCell>

                                    <TableCell>
                                        {new Date(medicine.expiryDate).toLocaleDateString("en-GB")}
                                    </TableCell>

                                    <TableCell>
                                        {medicine.supplier?.name}
                                    </TableCell>

                                    <TableCell className="text-right space-x-2 pr-10">

                                        <Link href={`/dashboard/medicine/${medicine.id}`}>
                                            <Button size="icon" variant="ghost" className="text-yellow-600 hover:bg-yellow-100">
                                                <Pencil size={18} />
                                            </Button>
                                        </Link>

                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button size="icon" variant="ghost" className="text-red-600 hover:bg-red-100">
                                                    <Trash2 size={18} />
                                                </Button>
                                            </AlertDialogTrigger>

                                            <AlertDialogContent className="bg-white">
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>
                                                        Delete Medicine
                                                    </AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        This action cannot be undone. It will permanently delete{" "}
                                                        <span className="font-semibold">
                                                            {medicine.name}
                                                        </span>.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>

                                                <AlertDialogFooter>
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
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Shadcn Pagination */}
            <div className="mt-6 flex justify-center">
                <Pagination>
                    <PaginationContent>

                        <PaginationItem>
                            <PaginationPrevious
                                onClick={() =>
                                    setCurrentPage((p) => Math.max(p - 1, 1))
                                }
                                className={
                                    currentPage === 1
                                        ? "pointer-events-none opacity-50"
                                        : "cursor-pointer"
                                }
                            />
                        </PaginationItem>

                        {Array.from({ length: totalPages || 1 }).map((_, i) => (
                            <PaginationItem key={i}>
                                <PaginationLink
                                    isActive={currentPage === i + 1}
                                    onClick={() => setCurrentPage(i + 1)}
                                >
                                    {i + 1}
                                </PaginationLink>
                            </PaginationItem>
                        ))}

                        <PaginationItem>
                            <PaginationNext
                                onClick={() =>
                                    setCurrentPage((p) =>
                                        Math.min(p + 1, totalPages || 1)
                                    )
                                }
                                className={
                                    currentPage === totalPages
                                        ? "pointer-events-none opacity-50"
                                        : "cursor-pointer"
                                }
                            />
                        </PaginationItem>

                    </PaginationContent>
                </Pagination>
            </div>
        </div>
    )
}