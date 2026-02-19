export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  stock: number;
  image?: string;
}

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}
