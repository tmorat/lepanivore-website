import { cloneDeep, isEmpty } from 'lodash';
import { ProductId } from '../type-aliases';
import { NewProductCommand } from './commands/new-product-command';
import { UpdateProductCommand } from './commands/update-product-command';
import { InvalidProductError } from './errors/invalid-product.error';
import { ProductStatus } from './product-status';
import { ProductInterface } from './product.interface';

export class Product implements ProductInterface {
  static factory: ProductFactoryInterface = {
    create(command: NewProductCommand): Product {
      return new Product({} as Product, command);
    },
    copy(product: ProductInterface): Product {
      return new Product(product, {} as NewProductCommand);
    },
  };

  id: ProductId;
  name: string;
  description: string;
  price: number;
  status: ProductStatus;

  private constructor(product: ProductInterface, command: NewProductCommand) {
    if (!isEmpty(product)) {
      this.copy(product);
    } else {
      Product.assertNameIsValid(command.name);
      Product.assertDescriptionIsValid(command.description);
      Product.assertPriceIsValid(command.price);

      this.id = undefined;
      this.name = command.name;
      this.description = command.description;
      this.price = command.price;
      this.status = ProductStatus.ACTIVE;
    }
  }

  private static assertNameIsValid(name: string): void {
    if (isEmpty(name)) {
      throw new InvalidProductError('name has to be defined');
    }
  }

  private static assertDescriptionIsValid(description: string): void {
    if (isEmpty(description)) {
      throw new InvalidProductError('description has to be defined');
    }
  }

  private static assertPriceIsValid(price: number): void {
    if (price <= 0) {
      throw new InvalidProductError('price has to be a positive value');
    }
  }

  archive(): void {
    this.status = ProductStatus.ARCHIVED;
  }

  updateWith(command: UpdateProductCommand): void {
    if (this.id !== command.productId) {
      throw new InvalidProductError('existing product id does not match product id in command');
    }

    Product.assertDescriptionIsValid(command.description);
    this.description = command.description;
  }

  private copy(otherProduct: ProductInterface): void {
    const deepCloneOfOtherProduct: ProductInterface = cloneDeep(otherProduct);
    for (const field in deepCloneOfOtherProduct) {
      if (deepCloneOfOtherProduct.hasOwnProperty(field)) {
        this[field] = deepCloneOfOtherProduct[field];
      }
    }
  }
}

export interface ProductFactoryInterface {
  create(command: NewProductCommand): Product;
  copy(product: ProductInterface): Product;
}
