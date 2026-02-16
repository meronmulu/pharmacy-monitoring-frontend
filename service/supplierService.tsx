import instance from "@/axios"

export const getAllSuppliers = async () => {
  const res = await instance.get("/suppliers");
  return res.data.data;  
};

