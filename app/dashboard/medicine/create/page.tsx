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
 console.log("Sending data to backend:", formattedData);

    await createMedicine(formattedData);

    alert("Medicine Added Successfully 💊");
    router.push("/dashboard/medicine");
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Add New Medicine
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-6 space-y-4"
      >
        {/* Name */}
        <div>
          <label className="block mb-1 font-medium">Medicine Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border rounded-md p-2"
          />
        </div>

        {/* Price */}
        <div>
          <label className="block mb-1 font-medium">Price (ETB)</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="w-full border rounded-md p-2"
          />
        </div>

        {/* Quantity */}
        <div>
          <label className="block mb-1 font-medium">Quantity</label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            className="w-full border rounded-md p-2"
          />
        </div>

        {/* Expiry */}
        <div>
          <label className="block mb-1 font-medium">Expiry Date</label>
          <input
            type="date"
            name="expiryDate"
            value={formData.expiryDate}
            onChange={handleChange}
            className="w-full border rounded-md p-2"
          />
        </div>

        {/* Supplier Dropdown */}
        <div>
          <label className="block mb-1 font-medium">Supplier</label>
          <select
            name="supplierId"
            value={formData.supplierId}
            onChange={handleChange}
            className="w-full border rounded-md p-2"
          >
            <option value="">Select Supplier</option>
            {suppliers.map((supplier) => (
              <option key={supplier.id} value={supplier.id}>
                {supplier.name}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
        >
          Add Medicine
        </button>
      </form>
    </div>
  );
}
