import { Injectable } from '@nestjs/common';
import { ValueTransformer } from 'typeorm';
import { ProductStatus } from '../../../domain/product/product-status';
import { ProductInterface } from '../../../domain/product/product.interface';
import { ProductEntity } from './product.entity';

@Injectable()
export class ProductEntityTransformer implements ValueTransformer {
  from(productEntity: ProductEntity): ProductInterface {
    return {
      id: productEntity.id,
      name: productEntity.name,
      description: productEntity.description,
      price: productEntity.price,
      status: productEntity.status as ProductStatus,
    };
  }

  to(product: ProductInterface): ProductEntity {
    const productEntity: ProductEntity = new ProductEntity();
    productEntity.id = product.id;
    productEntity.name = product.name;
    productEntity.description = product.description;
    productEntity.price = product.price;
    productEntity.status = product.status;

    return productEntity;
  }
}
