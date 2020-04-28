import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { ProductNotFoundError } from '../../src/domain/product-not-found.error';
import { ProductStatus } from '../../src/domain/product-status';
import { ProductInterface } from '../../src/domain/product.interface';
import { ProductId } from '../../src/domain/type-aliases';
import { EnvironmentConfigService } from '../../src/infrastructure/config/environment-config/environment-config.service';
import { DatabaseProductRepository } from '../../src/infrastructure/repositories/database-product.repository';
import { ProductEntity } from '../../src/infrastructure/repositories/entities/product.entity';
import { RepositoriesModule } from '../../src/infrastructure/repositories/repositories.module';
import { e2eEnvironmentConfigService } from '../e2e-config';
import { runDatabaseMigrations } from './database-e2e.utils';

describe('infrastructure/repositories/DatabaseProductRepository', () => {
  let app: INestApplication;
  let databaseProductRepository: DatabaseProductRepository;
  let productEntityRepository: Repository<ProductEntity>;
  let productWithoutId: ProductInterface;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [RepositoriesModule],
    })
      .overrideProvider(EnvironmentConfigService)
      .useValue(e2eEnvironmentConfigService)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    await runDatabaseMigrations(app.get(EnvironmentConfigService));

    databaseProductRepository = app.get(DatabaseProductRepository);
    // @ts-ignore
    productEntityRepository = databaseProductRepository.productEntityRepository;
  });

  beforeEach(async () => {
    await productEntityRepository.clear();

    productWithoutId = {
      name: 'product name',
      description: 'product description',
      price: 12.34,
      status: ProductStatus.ACTIVE,
    } as ProductInterface;
  });

  describe('save()', () => {
    it('should persist product in database', async () => {
      // when
      await databaseProductRepository.save(productWithoutId);

      // then
      const count: number = await productEntityRepository.count();
      expect(count).toBe(1);
    });

    it('should return saved product with an id', async () => {
      // when
      const result: ProductId = await databaseProductRepository.save(productWithoutId);

      // then
      expect(result).toBeDefined();
    });
  });

  describe('findById()', () => {
    it('should return found product in database', async () => {
      // given
      await databaseProductRepository.save(productWithoutId);
      const productWithoutIdAndDifferentName: ProductInterface = { ...productWithoutId, name: 'another product' };
      const savedProductIdDifferentName: ProductId = await databaseProductRepository.save(productWithoutIdAndDifferentName);

      // when
      const result: ProductInterface = await databaseProductRepository.findById(savedProductIdDifferentName);

      // then
      expect(result.id).toBe(savedProductIdDifferentName);
      expect(result).toMatchObject(productWithoutIdAndDifferentName);
    });

    it('should throw exception when product not found in database', async () => {
      // given
      const randomId: ProductId = Math.floor(Math.random() * 1000 + 1000);

      // when
      const result: Promise<ProductInterface> = databaseProductRepository.findById(randomId);

      // then
      await expect(result).rejects.toThrow(new ProductNotFoundError(`Product not found with id "${randomId}"`));
    });
  });

  describe('findAllByStatus()', () => {
    it('should return active products in database when searching for active status', async () => {
      // given
      await databaseProductRepository.save(productWithoutId);
      const productWithoutIdAndDifferentName: ProductInterface = { ...productWithoutId, name: 'another active product' };
      await databaseProductRepository.save(productWithoutIdAndDifferentName);
      const productWithoutIdAndDifferentNameAndDifferentStatus: ProductInterface = {
        ...productWithoutId,
        name: 'archived product',
        status: ProductStatus.ARCHIVED,
      };
      await databaseProductRepository.save(productWithoutIdAndDifferentNameAndDifferentStatus);

      // when
      const result: ProductInterface[] = await databaseProductRepository.findAllByStatus(ProductStatus.ACTIVE);

      // then
      expect(result).toHaveLength(2);
      expect(result[0]).toMatchObject(productWithoutId);
      expect(result[1]).toMatchObject(productWithoutIdAndDifferentName);
    });

    it('should return archived products in database when searching for archived status', async () => {
      // given
      await databaseProductRepository.save(productWithoutId);
      const productWithoutIdAndDifferentName: ProductInterface = { ...productWithoutId, name: 'another active product' };
      await databaseProductRepository.save(productWithoutIdAndDifferentName);
      const productWithoutIdAndDifferentNameAndDifferentStatus: ProductInterface = {
        ...productWithoutId,
        name: 'archived product',
        status: ProductStatus.ARCHIVED,
      };
      await databaseProductRepository.save(productWithoutIdAndDifferentNameAndDifferentStatus);

      // when
      const result: ProductInterface[] = await databaseProductRepository.findAllByStatus(ProductStatus.ARCHIVED);

      // then
      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject(productWithoutIdAndDifferentNameAndDifferentStatus);
    });

    it('should return empty array when no product has been found in database', async () => {
      // when
      const result: ProductInterface[] = await databaseProductRepository.findAllByStatus(ProductStatus.ACTIVE);

      // then
      expect(result).toHaveLength(0);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
