export interface Product {
  id: string;
  userId: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  cost: number;
  stock: number;
  minStock: number;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number; // For sales this is selling price, for purchases this is cost
  total: number;
}

export interface Sale {
  id: string;
  userId: string;
  customerName?: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  total: number;
  paymentMethod: 'Cash' | 'Card' | 'Mobile Banking';
  date: string;
  createdAt: string;
}
