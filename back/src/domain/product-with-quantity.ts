import { ProductInterface } from './product.interface';
import { ProductId } from './type-aliases';

export interface ProductWithQuantity {
  product: ProductInterface;
  quantity: number;
}

export interface ProductIdWithQuantity {
  productId: ProductId;
  quantity: number;
}
