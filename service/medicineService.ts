import instance from "@/axios";
import { Medicine } from "@/types";


export async function getAllmedicines(): Promise<Medicine[]> {
  try {
    const res = await instance.get("/medicines/");
    console.log(res.data);
    return res.data.data;

  } catch (error) {
    console.log("Error fetching medicines:", error);
    return [];
  }
}
export const createMedicine = async (medicineData: Partial<Medicine>): Promise<Medicine | null> => {
  try {
    const res = await instance.post<{ data: Medicine }>("/medicines/create-medicine", medicineData);

    if (res.data?.data) {
      console.log("Medicine registered successfully:", res.data.data);
      return res.data.data;
    }

    console.error("Unexpected response structure:", res.data);
    return null;
  } catch (error) {
    console.error("Error creating medicine:", error);
    return null;
  }
};

export const getMedicineById = async (id: number): Promise<Medicine | null> => {
  try {
    const res = await instance.get(`/medicines/${id}`); 
    console.log("Fetched medicine:", res.data.data);
    return res.data.data;
  } catch (error) {
    console.error( error);
    return null;
  }
};


 export const updateMedicine = async (id: number, userData: Partial<Medicine> ) =>{
  try {
     const res = await instance.put<{data: Medicine}>(`/medicines/${id}`, userData);
         console.log(res.data.data)
            return res.data.data
    } catch (error) {
        console.log(error)
    }
}

export const deleteMedicine = async(id: number): Promise<boolean> =>{
    try {
        const res = await instance.delete(`/medicines/${id}`)
        console.log(res);
        return true
    } catch (error) {
        console.log(error)
        return false 
    }
}
