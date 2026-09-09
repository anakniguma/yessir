export interface Product {
  id: number;
  name: string;
  origin: string;
  category: string;
  price: number;
  description: string;
  flavorNotes: string[];
  roast: 'Light' | 'Medium' | 'Medium-Dark' | 'Dark';
  weight: string;
  image: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}
