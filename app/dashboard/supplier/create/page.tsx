'use client';

import { useState, useEffect } from "react";
import { createSupplier, getAllSuppliers } from "@/service/supplierService";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field";
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

  

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    const formattedData = {
      ...formData,
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      address: formData.address,
    };

    await createSupplier(formattedData);

    toast.success("Supplier added successfully ", {
      position: "top-center",
    });

    setTimeout(() => {
      router.push("/dashboard/supplier");
    }, 800);

  } catch (error) {
    console.error("Failed to add supplier:", error);

     toast.error("Failed to add supplier. Check console.");
  }
};

  return (
  <div className="bg-[#F7F8FA]">
    <div className="max-w-2xl mx-auto ">
      <div className="bg-white rounded-2xl shadow-sm border p-8  ">

        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <FieldSet>
              <FieldLegend>
                <p className="text-2xl font-bold">Add Supplier</p>
              </FieldLegend>

              <FieldDescription>
                Enter supplier details below to add it to inventory
              </FieldDescription>

              <FieldGroup className="">

                {/* Supplier Name */}
                <Field>
                  <FieldLabel>Supplier Name</FieldLabel>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                    placeholder="Enter supplier name"
                  />
                </Field>

                {/* Phone */}
                <Field>
                  <FieldLabel>Phone Number</FieldLabel>
                  <Input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    required
                    placeholder="Enter phone number"
                  />
                </Field>

                {/* Email */}
                <Field>
                  <FieldLabel>Email Address</FieldLabel>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                    placeholder="Enter email address"
                  />
                </Field>

                {/* Address */}
                <Field>
                  <FieldLabel>Address</FieldLabel>
                  <Input
                    name="address"
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    required
                    placeholder="Enter supplier address"
                    className="hover:border-green-500"
                  />
                </Field>

              </FieldGroup>
            </FieldSet>

            <Field orientation="horizontal" className="pt-6">
              <Button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                Add Supplier
              </Button>
            </Field>
          </FieldGroup>
        </form>

      </div>
    </div>
  </div>
)
  
}