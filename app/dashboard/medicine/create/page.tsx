'use client';

import { useState, useEffect } from "react";
import { getAllSuppliers } from "@/service/supplierService";
import { createMedicine } from "@/service/medicineService";
import { useRouter } from "next/navigation";

interface Supplier {
  id: number;
  name: string;
}

export default function AddMedicinePage() {
  const router = useRouter();
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    quantity: "",
    expiryDate: "",
    supplierId: ""
  });

  useEffect(() => {
    const fetchSuppliers = async () => {
      const data = await getAllSuppliers();
      setSuppliers(data);
    };
    fetchSuppliers();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formattedData = {
      ...formData,
      price: Number(formData.price),
      quantity: Number(formData.quantity),
      supplierId: Number(formData.supplierId),
      expiryDate: new Date(formData.expiryDate).toISOString()
    };

    await createMedicine(formattedData);

    alert("Medicine Added Successfully 💊");
    router.push("/dashboard/medicine");
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA] flex justify-center items-start py-16 px-6">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg border border-gray-100">

        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-100">
          <h1 className="text-2xl font-semibold text-gray-800">
            Add New Medicine
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Enter medicine details below to add it to inventory
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="px-8 py-8 space-y-6"
        >

          {/* Medicine Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Medicine Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full h-11 rounded-lg border border-gray-200 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
              placeholder="Enter medicine name"
            />
          </div>

          {/* Price + Quantity Grid */}
          <div className="grid md:grid-cols-2 gap-6">

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Price (ETB)
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                className="w-full h-11 rounded-lg border border-gray-200 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
                placeholder="0.00"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Quantity
              </label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                required
                className="w-full h-11 rounded-lg border border-gray-200 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
                placeholder="Enter quantity"
              />
            </div>

          </div>

          {/* Expiry + Supplier Grid */}
          <div className="grid md:grid-cols-2 gap-6">

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Expiry Date
              </label>
              <input
                type="date"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleChange}
                required
                className="w-full h-11 rounded-lg border border-gray-200 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Supplier
              </label>
              <select
                name="supplierId"
                value={formData.supplierId}
                onChange={handleChange}
                required
                className="w-full h-11 rounded-lg border border-gray-200 px-3 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
              >
                <option value="">Select Supplier</option>
                {suppliers.map((supplier) => (
                  <option key={supplier.id} value={supplier.id}>
                    {supplier.name}
                  </option>
                ))}
              </select>
            </div>

          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              className="w-full h-11 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium transition shadow-md"
            >
              Add Medicine
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}