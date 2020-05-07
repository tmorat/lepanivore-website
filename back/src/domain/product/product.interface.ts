import { ProductId } from '../type-aliases';
import { ProductStatus } from './product-status';

export interface ProductInterface {
  id: ProductId;
  name: string;
  description: string;
  price: number;
  status: ProductStatus;
}
