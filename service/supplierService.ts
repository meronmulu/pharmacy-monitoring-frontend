import instance from "@/axios"
import {Supplier } from "@/types";

export async function getAllSuppliers(): Promise<Supplier[]> {
  try {
    const res = await instance.get("/suppliers/");
    console.log(res.data);
    return res.data.data;

  } catch (error) {
    console.log("Error fetching suppliers:", error);
    return [];
  }
}



export const createSupplier = async (supplierData: Partial<Supplier>): Promise<Supplier | null> => {
  try {
    const res = await instance.post<{ data: Supplier }>("/suppliers/createSuppliers", supplierData);

    if (res.data?.data) {
      console.log("Supplier registered successfully:", res.data.data);
      return res.data.data;
    }

    console.error("Unexpected response structure:", res.data);
    return null;
  } catch (error) {
      console.log(error)
    }
    return null;
  }


export const getSupplierById = async (id: number): Promise<Supplier | null> => {
  try {
    const res = await instance.get(`/suppliers/${id}`); 
    console.log("Fetched supplier:", res.data.data);
    return res.data.data;
  } catch (error) {
    console.error( error);
    return null;
  }
};


 export const updateSupplier = async (id: number, userData: Partial<Supplier> ) =>{
  try {
     const res = await instance.put<{data: Supplier}>(`/suppliers/${id}`, userData);
         console.log(res.data.data)
            return res.data.data
    } catch (error) {
        console.log(error)
    }
}

export const deleteSupplier = async(id: number): Promise<boolean> =>{
    try {
        const res = await instance.delete(`/suppliers/${id}`)
        console.log(res);
        return true
    } catch (error) {
        console.log(error)
        return false 
    }
}