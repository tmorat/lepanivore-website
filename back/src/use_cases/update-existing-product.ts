import { UpdateProductCommand } from '../domain/product/commands/update-product-command';
import { Product } from '../domain/product/product';
import { ProductInterface } from '../domain/product/product.interface';
import { ProductRepository } from '../domain/product/product.repository';

export class UpdateExistingProduct {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(updateProductCommand: UpdateProductCommand): Promise<void> {
    const foundProduct: ProductInterface = await this.productRepository.findById(updateProductCommand.productId);
    const productToUpdate: Product = Product.factory.copy(foundProduct);
    productToUpdate.updateWith(updateProductCommand);
    await this.productRepository.save(productToUpdate);
  }
}
