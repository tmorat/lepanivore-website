import { NewProductCommand } from '../domain/product/commands/new-product-command';
import { Product } from '../domain/product/product';
import { ProductRepository } from '../domain/product/product.repository';
import { ProductId } from '../domain/type-aliases';

export class AddNewProduct {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(newProductCommand: NewProductCommand): Promise<ProductId> {
    const product: Product = Product.factory.create(newProductCommand);

    return this.productRepository.save(product);
  }
}
