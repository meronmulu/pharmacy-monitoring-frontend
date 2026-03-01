'use client';

import { useState, useEffect } from "react";
import { createSupplier, getAllSuppliers } from "@/service/supplierService";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
interface Supplier {
  id: number;
  name: string;
}

export default function AddSupplierPage() {
  const router = useRouter();
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
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
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      address: formData.address
    };

    await createSupplier(formattedData);

    alert("Supplier Added Successfully ");
    router.push("/dashboard/supplier");
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA] flex justify-center items-start p-4">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg border border-gray-100">

        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-100">
          <h1 className="text-2xl font-semibold text-gray-800">
            Add New Supplier
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Enter supplier details below to add it to inventory
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="px-8 py-8 space-y-6"
        >

          {/* Supplier Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Supplier Name
            </label>
            <Input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full h-11 rounded-lg border border-gray-200 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-500  transition"
              placeholder="Enter supplier name"
            />
          </div>


            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <Input
                type="number"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full h-11 rounded-lg border border-gray-200 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-500  transition"
                placeholder="Enter phone number"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Email
              </label>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full h-11 rounded-lg border border-gray-200 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-500  transition"
                placeholder="Enter email"
              />
            </div>


       

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Adress
              </label>
              <Input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                className="w-full h-11 rounded-lg border border-gray-200 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-500  transition"
                placeholder="Enter address"
              />
            </div>

            

          


          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              className="w-full h-11 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium transition shadow-md"
            >
              Add Supplier
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}