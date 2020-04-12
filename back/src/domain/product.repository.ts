import { Product } from './product';

export interface ProductRepository {
  findAll(): Promise<Product[]>;
}
