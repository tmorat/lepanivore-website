import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductNotFoundError } from '../../domain/product-not-found.error';
import { ProductStatus } from '../../domain/product-status';
import { ProductInterface } from '../../domain/product.interface';
import { ProductRepository } from '../../domain/product.repository';
import { ProductId } from '../../domain/type-aliases';
import { ProductEntityTransformer } from './entities/product-entity.transformer';
import { ProductEntity } from './entities/product.entity';

@Injectable()
export class DatabaseProductRepository implements ProductRepository {
  constructor(
    @InjectRepository(ProductEntity) private readonly productEntityRepository: Repository<ProductEntity>,
    private readonly productEntityTransformer: ProductEntityTransformer
  ) {}

  async save(product: ProductInterface): Promise<ProductId> {
    const productEntity: ProductEntity = this.productEntityTransformer.to(product);
    const savedProductEntity: ProductEntity = await this.productEntityRepository.save(productEntity);

    return Promise.resolve(savedProductEntity.id);
  }

  async findById(productId: ProductId): Promise<ProductInterface> {
    const foundProductEntity: ProductEntity = await this.productEntityRepository.findOne({ where: { id: productId } });
    if (!foundProductEntity) {
      return Promise.reject(new ProductNotFoundError(`Product not found with id "${productId}"`));
    }

    return Promise.resolve(this.productEntityTransformer.from(foundProductEntity));
  }

  async findAllByStatus(status: ProductStatus): Promise<ProductInterface[]> {
    const foundProductEntities: ProductEntity[] = await this.productEntityRepository.find({ where: { status } });
    const result: ProductInterface[] = foundProductEntities.map((productEntity: ProductEntity) => this.productEntityTransformer.from(productEntity));

    return Promise.resolve(result);
  }
}
