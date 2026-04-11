export interface Product {
  ID: number;
  Nombre: string;
  Categoria1: string;
  Categoria2: string;
  Categoria3: string;
  Marca: string;
  Precio: number;
  Img1: string;
  Img2: string;
  Img3: string;
  Destacado: string;
  Slug: string;
  Estado: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}
