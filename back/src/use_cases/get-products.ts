import { Product } from '../domain/product';
import { ProductRepository } from '../domain/product.repository';

export class GetProducts {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(): Promise<Product[]> {
    return this.productRepository.findAll();
  }
}
