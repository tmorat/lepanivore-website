import { Product } from './product';
import { ProductId } from './type-aliases';

export interface ProductWithQuantity {
  product: Product;
  quantity: number;
}

export interface ProductIdWithQuantity {
  productId: ProductId;
  quantity: number;
}
