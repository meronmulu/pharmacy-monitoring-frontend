import instance from "@/axios";
import { Sale } from "@/types";

export const getAllSales = async () => {
  const res = await instance.get("/sales/");
  return res.data.data;  
};


export const createSale = async (saleData: Partial<Sale>): Promise<Sale | null> => {
  try {
    const res = await instance.post<{ data: Sale }>("/sales/", saleData);

    if (res.data?.data) {
      console.log("sale add successfully:", res.data.data);
      return res.data.data;
    }

    console.error("Unexpected response structure:", res.data);
    return null;
  } catch (error) {
    console.log(error);
    return null;
}


}
 export const getSalesByCashierId = async (cashierId: number) => {
  try {
    const response = await instance.get(`/sales/cashier/${cashierId}`)

    return response.data.data
  } catch (error) {
    console.log(error)
  }
}

export const deleteSale = async(id: number): Promise<boolean> =>{
    try {
        const res = await instance.delete(`/sales/${id}`)
        console.log(res);
        return true
    } catch (error) {
        console.log(error)
        return false 
    }
}