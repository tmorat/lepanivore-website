import { NewProductCommand } from '../domain/commands/new-product-command';
import { Product } from '../domain/product';
import { ProductRepository } from '../domain/product.repository';
import { ProductId } from '../domain/type-aliases';

export class AddNewProduct {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(newProductCommand: NewProductCommand): Promise<ProductId> {
    const product: Product = Product.factory.create(newProductCommand);

    return this.productRepository.save(product);
  }
}
