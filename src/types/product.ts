export interface ProductHandler {
  title: string;
  price: number;
  stock_quantity: number;
  images: Array<string>;
  description: string;
  creation_time: number;
  discount_price?: number;
}