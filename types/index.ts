export interface User {
    id: number;
    name: string;
    email: string;
    password: string;
    role: string
   [key: string]: unknown;
  }
export interface Supplier {
  id: number
  name: string
}

export interface Medicine {
  id: number;
  name: string;
  price: number;
  quantity: number;
  expiryDate: string;
  supplierId: number;
  supplier?: {
    id: number;
    name: string;
  };
}

export interface SaleItem {
  id: number
  saleId: number
  medicineId: number
  quantity: number
  price: number
  medicine: {
    id: number
    name: string
  }
}

export interface Sale {
  id: number
  cashierId: number
  cashier: {
    id: number
    name: string
  }
  total: number
  status: "PENDING" | "COMPLETED" | "CANCELLED"
  items: SaleItem[]
  createdAt: string
}


