// frontend/src/types/index.ts

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  imageUrls?: string[]; // Modificado para ser um array de strings
}