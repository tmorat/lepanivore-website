import { ProductStatus } from '../../../../domain/product-status';
import { ProductInterface } from '../../../../domain/product.interface';
import { ProductEntityTransformer } from '../product-entity.transformer';
import { ProductEntity } from '../product.entity';

describe('infrastructure/repositories/entities/ProductEntityTransformer', () => {
  let productEntityTransformer: ProductEntityTransformer;
  beforeEach(() => {
    productEntityTransformer = new ProductEntityTransformer();
  });

  describe('from()', () => {
    it('should transform ProductEntity to ProductInterface', () => {
      // given
      const productEntity: ProductEntity = {
        id: 42,
        name: 'product name',
        description: 'product description',
        price: 12345,
        status: 'ACTIVE',
      } as ProductEntity;

      // when
      const result: ProductInterface = productEntityTransformer.from(productEntity);

      // then
      expect(result).toStrictEqual({
        id: 42,
        name: 'product name',
        description: 'product description',
        price: 12345,
        status: ProductStatus.ACTIVE,
      } as ProductInterface);
    });
  });

  describe('to()', () => {
    it('should transform ProductInterface to ProductEntity', () => {
      // given
      const product: ProductInterface = {
        id: 42,
        name: 'product name',
        description: 'product description',
        price: 12345,
        status: ProductStatus.ACTIVE,
      };

      // when
      const result: ProductEntity = productEntityTransformer.to(product);

      // then
      expect(result).toMatchObject({
        id: 42,
        name: 'product name',
        description: 'product description',
        price: 12345,
        status: 'ACTIVE',
      } as ProductEntity);
    });
  });
});
