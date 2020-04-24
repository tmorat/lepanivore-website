import { ProductInterface } from './product.interface';

export interface ProductRepository {
  findAll(): Promise<ProductInterface[]>;
}
