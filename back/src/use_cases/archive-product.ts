import { ArchiveProductCommand } from '../domain/commands/archive-product-command';
import { Product } from '../domain/product';
import { ProductInterface } from '../domain/product.interface';
import { ProductRepository } from '../domain/product.repository';

export class ArchiveProduct {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(archiveProductCommand: ArchiveProductCommand): Promise<void> {
    const existingProduct: ProductInterface = await this.productRepository.findById(archiveProductCommand.productId);
    const productToArchive: Product = Product.factory.copy(existingProduct);
    productToArchive.archive();
    await this.productRepository.save(productToArchive);
  }
}
