export interface Product {
  ID: number;
  Nombre: string;
  Categoria1: string;
  Categoria2: string;
  Categoria3: string;
  Marca: string;
  Precio: number;
  "Precio Oferta"?: number;
  Img1: string;
  Img2: string;
  Img3: string;
  Destacado: string;
  "3x1"?: string;
  "2x1"?: string;
  Slug: string;
  Estado: string;
  Talle?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  size?: string;
}
