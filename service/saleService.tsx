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
  } catch (error: any) {
    console.error("Registration error:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    return null;
  }
};


export const dailyReport = async () => {
  const res = await instance.get("/reports/daily");
  return res.data.data;  
};
export const weeklyReport = async () => {
  const res = await instance.get("/reports/weekly");
  return res.data.data;  
};
export const monthlyReport = async () => {
  const res = await instance.get("/reports/monthly");
  return res.data.data;  
};