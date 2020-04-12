import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request, { Response } from 'supertest';
import { Product } from '../../src/domain/product';
import { EnvironmentConfigService } from '../../src/infrastructure/config/environment-config/environment-config.service';
import { GetProductResponse } from '../../src/infrastructure/rest/models/get-product-response';
import { RestModule } from '../../src/infrastructure/rest/rest.module';
import { ProxyServicesDynamicModule } from '../../src/infrastructure/use_cases_proxy/proxy-services-dynamic.module';
import { UseCaseProxy } from '../../src/infrastructure/use_cases_proxy/use-case-proxy';
import { GetProducts } from '../../src/use_cases/get-products';
import { e2eEnvironmentConfigService } from '../e2e-config';

describe('infrastructure/rest/ProductController (e2e)', () => {
  let app: INestApplication;
  let mockGetProducts: GetProducts;

  beforeAll(async () => {
    mockGetProducts = {} as GetProducts;
    mockGetProducts.execute = jest.fn();
    const mockGetProductsProxyService: UseCaseProxy<GetProducts> = {
      getInstance: () => mockGetProducts,
    } as UseCaseProxy<GetProducts>;

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [RestModule],
    })
      .overrideProvider(ProxyServicesDynamicModule.GET_PRODUCTS_PROXY_SERVICE)
      .useValue(mockGetProductsProxyService)
      .overrideProvider(EnvironmentConfigService)
      .useValue(e2eEnvironmentConfigService)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('GET /api/closing-periods', () => {
    it('should return http status code OK with found closing periods', () => {
      // given
      const products: Product[] = [
        { id: 1, name: 'fake product 1' } as Product,
        {
          id: 2,
          name: 'fake product 2',
        } as Product,
      ];
      (mockGetProducts.execute as jest.Mock).mockReturnValue(Promise.resolve(products));

      // when
      const testRequest: request.Test = request(app.getHttpServer()).get('/api/products');

      // then
      return testRequest.expect(200).expect((response: Response) => {
        expect(response.body).toStrictEqual(products as GetProductResponse[]);
      });
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
