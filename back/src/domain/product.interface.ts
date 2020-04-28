import { ProductStatus } from './product-status';
import { ProductId } from './type-aliases';

export interface ProductInterface {
  id: ProductId;
  name: string;
  description: string;
  price: number;
  status: ProductStatus;
}
