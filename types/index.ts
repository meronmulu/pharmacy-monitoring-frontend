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

