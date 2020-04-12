import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { Order } from '../../src/domain/order';
import { OrderType } from '../../src/domain/order-type';
import { OrderId } from '../../src/domain/type-aliases';
import { EnvironmentConfigService } from '../../src/infrastructure/config/environment-config/environment-config.service';
import { DatabaseOrderRepository } from '../../src/infrastructure/repositories/database-order.repository';
import { OrderEntity } from '../../src/infrastructure/repositories/entities/order.entity';
import { RepositoriesModule } from '../../src/infrastructure/repositories/repositories.module';
import { e2eEnvironmentConfigService } from '../e2e-config';
import { runDatabaseMigrations } from './database-e2e.utils';

describe('infrastructure/repositories/DatabaseOrderRepository', () => {
  let app: INestApplication;
  let databaseOrderRepository: DatabaseOrderRepository;
  let orderEntityRepository: Repository<OrderEntity>;
  let orderWithoutId: Order;

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

    databaseOrderRepository = app.get(DatabaseOrderRepository);
    // @ts-ignore
    orderEntityRepository = databaseOrderRepository.orderEntityRepository;
  });

  beforeEach(async () => {
    await orderEntityRepository.clear();

    orderWithoutId = {
      clientName: 'John Doe',
      clientPhoneNumber: '+1 514 111 1111',
      clientEmailAddress: 'test@example.org',
      products: [
        { product: { id: 1, name: 'product 1', description: 'product 1 description', price: 1.11 }, quantity: 1 },
        { product: { id: 2, name: 'product 2', description: 'product 2 description', price: 2.22 }, quantity: 2 },
      ],
      type: OrderType.PICK_UP,
      pickUpDate: new Date('2020-06-13T04:41:20'),
      deliveryAddress: 'Montréal',
    } as Order;
  });

  describe('save()', () => {
    it('should persist order in database', async () => {
      // when
      await databaseOrderRepository.save(orderWithoutId);

      // then
      const count: number = await orderEntityRepository.count();
      expect(count).toBe(1);
    });

    it('should return saved order with an id', async () => {
      // when
      const result: OrderId = await databaseOrderRepository.save(orderWithoutId);

      // then
      expect(result).toBeDefined();
    });
  });

  describe('findAll()', () => {
    it('should return found companies in database', async () => {
      // given
      await databaseOrderRepository.save(orderWithoutId);
      const orderWithoutIdAndDifferentClientName: Order = { ...orderWithoutId, clientName: 'Harry Potter' };
      await databaseOrderRepository.save(orderWithoutIdAndDifferentClientName);

      // when
      const result: Order[] = await databaseOrderRepository.findAll();

      // then
      expect(result).toHaveLength(2);
      expect(result[0]).toMatchObject(orderWithoutId);
      expect(result[1]).toMatchObject(orderWithoutIdAndDifferentClientName);
    });

    it('should return empty array when no order has been found in database', async () => {
      // when
      const result: Order[] = await databaseOrderRepository.findAll();

      // then
      expect(result).toHaveLength(0);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
