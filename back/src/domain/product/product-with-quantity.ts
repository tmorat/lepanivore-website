import { ProductId } from '../type-aliases';
import { ProductInterface } from './product.interface';

export interface ProductWithQuantity {
  product: ProductInterface;
  quantity: number;
}

export interface ProductIdWithQuantity {
  productId: ProductId;
  quantity: number;
}
