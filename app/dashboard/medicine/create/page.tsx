'use client';

import { useState, useEffect } from "react";
import { getAllSuppliers } from "@/service/supplierService";
import { createMedicine } from "@/service/medicineService";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner";
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
    try {
      const formattedData = {
        ...formData,
        price: Number(formData.price),
        quantity: Number(formData.quantity),
        supplierId: Number(formData.supplierId),
        expiryDate: new Date(formData.expiryDate).toISOString()
      };

      await createMedicine(formattedData);

      toast.success("Medicine Added Successfully ");
      router.push("/dashboard/medicine");

    } catch (error) {
      console.error("Failed to add medicine:", error);
      toast.error("Failed to add medicine. Check console.");
    }
  };

  return (
    <div className=" bg-[#F7F8FA]">
      <div className="max-w-3xl  mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border p-8">

          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <FieldSet>
                <FieldLegend>
                  <p className="text-2xl font-bold">Add New Medicine</p>
                </FieldLegend>

                <FieldDescription>
                  Enter medicine details below to add it to inventory
                </FieldDescription>

                <FieldGroup className="">

                  {/* Medicine Name */}
                  <Field>
                    <FieldLabel>Medicine Name</FieldLabel>
                    <Input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Enter medicine name"
                    />
                  </Field>

                  {/* Price + Quantity */}
                  <div className="grid md:grid-cols-2 gap-6">

                    <Field>
                      <FieldLabel>Price (ETB)</FieldLabel>
                      <Input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        required
                        placeholder="0.00"
                      />
                    </Field>

                    <Field>
                      <FieldLabel>Quantity</FieldLabel>
                      <Input
                        type="number"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleChange}
                        required
                        placeholder="Enter quantity"
                      />
                    </Field>

                  </div>

                  {/* Expiry + Supplier */}
                  <div className="grid md:grid-cols-2 gap-6">

                    <Field>
                      <FieldLabel>Expiry Date</FieldLabel>
                      <Input
                        type="date"
                        name="expiryDate"
                        value={formData.expiryDate}
                        onChange={handleChange}
                        required
                      />
                    </Field>

                    <Field>
                      <FieldLabel>Supplier</FieldLabel>
                      <Select
                        value={formData.supplierId}
                        onValueChange={(value) =>
                          setFormData((prev) => ({
                            ...prev,
                            supplierId: value,
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Supplier" />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                          {suppliers.map((supplier) => (
                            <SelectItem
                              key={supplier.id}
                              value={supplier.id.toString()}
                            >
                              {supplier.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Field>

                  </div>

                </FieldGroup>
              </FieldSet>

              <Field orientation="horizontal" className="pt-6">
                <Button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  Add Medicine
                </Button>
              </Field>

            </FieldGroup>
          </form>

        </div>
      </div>
    </div>
  );
}