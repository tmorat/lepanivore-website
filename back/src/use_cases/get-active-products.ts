import { ProductStatus } from '../domain/product-status';
import { ProductInterface } from '../domain/product.interface';
import { ProductRepository } from '../domain/product.repository';

export class GetActiveProducts {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(): Promise<ProductInterface[]> {
    return this.productRepository.findAllByStatus(ProductStatus.ACTIVE);
  }
}
