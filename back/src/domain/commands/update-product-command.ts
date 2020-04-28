import { ProductId } from '../type-aliases';

export interface UpdateProductCommand {
  productId: ProductId;
  description: string;
}
