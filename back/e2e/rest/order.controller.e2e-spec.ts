import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request, { Response } from 'supertest';
import { InvalidOrderError } from '../../src/domain/invalid-order.error';
import { Order } from '../../src/domain/order';
import { OrderType } from '../../src/domain/order-type';
import { OrderId } from '../../src/domain/type-aliases';
import { EnvironmentConfigService } from '../../src/infrastructure/config/environment-config/environment-config.service';
import { GetOrderResponse } from '../../src/infrastructure/rest/models/get-order-response';
import { PostOrderRequest } from '../../src/infrastructure/rest/models/post-order-request';
import { RestModule } from '../../src/infrastructure/rest/rest.module';
import { ProxyServicesDynamicModule } from '../../src/infrastructure/use_cases_proxy/proxy-services-dynamic.module';
import { UseCaseProxy } from '../../src/infrastructure/use_cases_proxy/use-case-proxy';
import { GetProducts } from '../../src/use_cases/get-products';
import { OrderProducts } from '../../src/use_cases/order-products';
import { e2eEnvironmentConfigService } from '../e2e-config';

describe('infrastructure/rest/OrderController (e2e)', () => {
  let app: INestApplication;
  let mockGetOrders: GetProducts;
  let mockOrderProducts: OrderProducts;

  beforeAll(async () => {
    mockGetOrders = {} as GetProducts;
    mockGetOrders.execute = jest.fn();
    const mockGetProductsProxyService: UseCaseProxy<GetProducts> = {
      getInstance: () => mockGetOrders,
    } as UseCaseProxy<GetProducts>;

    mockOrderProducts = {} as OrderProducts;
    mockOrderProducts.execute = jest.fn();
    const mockOrderProductsProxyService: UseCaseProxy<OrderProducts> = {
      getInstance: () => mockOrderProducts,
    } as UseCaseProxy<OrderProducts>;

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [RestModule],
    })
      .overrideProvider(ProxyServicesDynamicModule.GET_ORDERS_PROXY_SERVICE)
      .useValue(mockGetProductsProxyService)
      .overrideProvider(ProxyServicesDynamicModule.ORDER_PRODUCTS_PROXY_SERVICE)
      .useValue(mockOrderProductsProxyService)
      .overrideProvider(EnvironmentConfigService)
      .useValue(e2eEnvironmentConfigService)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('POST /api/orders', () => {
    it('should return http status code OK with found orders', () => {
      // given
      const orders: Order[] = [
        { id: 1, clientName: 'fake order 1' } as Order,
        {
          id: 2,
          clientName: 'fake order 2',
        } as Order,
      ];
      (mockGetOrders.execute as jest.Mock).mockReturnValue(Promise.resolve(orders));

      // when
      const testRequest: request.Test = request(app.getHttpServer()).get('/api/orders');

      // then
      return testRequest.expect(200).expect((response: Response) => {
        expect(response.body).toStrictEqual(orders as GetOrderResponse[]);
      });
    });
  });

  describe('POST /api/orders', () => {
    it('should create order using body request transformed to command', () => {
      // given
      const postOrderRequest: PostOrderRequest = {
        clientName: 'John Doe',
        clientPhoneNumber: '514-123-4567',
        clientEmailAddress: 'test@example.org',
        products: [{ productId: 42, quantity: 1 }],
        type: 'DELIVERY',
        pickUpDate: '2020-06-13T04:41:20',
        deliveryAddress: 'Montréal',
      };

      // when
      const testRequest: request.Test = request(app.getHttpServer())
        .post('/api/orders')
        .send(postOrderRequest);

      // then
      return testRequest.expect(201).expect((response: Response) => {
        expect(mockOrderProducts.execute).toHaveBeenCalledWith({
          clientName: 'John Doe',
          clientPhoneNumber: '514-123-4567',
          clientEmailAddress: 'test@example.org',
          products: [{ productId: 42, quantity: 1 }],
          type: OrderType.DELIVERY,
          pickUpDate: new Date('2020-06-13T04:41:20'),
          deliveryAddress: 'Montréal',
        });
      });
    });

    it('should return http status code CREATED with created order id and location to it', () => {
      // given
      const orderId: OrderId = 42;
      (mockOrderProducts.execute as jest.Mock).mockReturnValue(Promise.resolve(orderId));

      // when
      const testRequest: request.Test = request(app.getHttpServer())
        .post('/api/orders')
        .send({} as PostOrderRequest);

      // then
      return testRequest.expect(201).expect((response: Response) => {
        expect(response.body).toStrictEqual({ id: orderId });
        expect(response.header.location).toBe('/api/orders/42');
      });
    });

    it('should return http status code BAD REQUEST when invalid order', () => {
      // given
      (mockOrderProducts.execute as jest.Mock).mockImplementation(() => {
        throw new InvalidOrderError('invalid order');
      });
      const fixedDate: Date = new Date('2020-06-13T04:41:20');
      // @ts-ignore
      jest.spyOn(global, 'Date').mockImplementationOnce(() => fixedDate);

      // when
      const testRequest: request.Test = request(app.getHttpServer())
        .post('/api/orders')
        .send({ value: '' });

      // then
      return testRequest.expect(400).expect({
        statusCode: 400,
        timestamp: '2020-06-13T08:41:20.000Z',
        name: 'Error',
        message: 'invalid order',
      });
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
