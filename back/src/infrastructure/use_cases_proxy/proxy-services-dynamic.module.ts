import { DynamicModule, Module } from '@nestjs/common';
import { DeleteOrder } from '../../use_cases/delete-order';
import { GetClosingPeriods } from '../../use_cases/get-closing-periods';
import { GetOrders } from '../../use_cases/get-orders';
import { GetProducts } from '../../use_cases/get-products';
import { OrderProducts } from '../../use_cases/order-products';
import { UpdateExistingOrder } from '../../use_cases/update-existing-order';
import { DatabaseOrderRepository } from '../repositories/database-order.repository';
import { EmailOrderNotificationRepository } from '../repositories/email-order-notification.repository';
import { InMemoryClosingPeriodRepository } from '../repositories/inmemory-closing-period.repository';
import { InMemoryProductRepository } from '../repositories/inmemory-product.repository';
import { RepositoriesModule } from '../repositories/repositories.module';
import { UseCaseProxy } from './use-case-proxy';

@Module({
  imports: [RepositoriesModule],
})
export class ProxyServicesDynamicModule {
  static ORDER_PRODUCTS_PROXY_SERVICE: string = 'OrderProductsProxyService';
  static GET_CLOSING_PERIODS_PROXY_SERVICE: string = 'GetClosingPeriodsProxyService';
  static GET_PRODUCTS_PROXY_SERVICE: string = 'GetProductsProxyService';
  static GET_ORDERS_PROXY_SERVICE: string = 'GetOrdersProxyService';
  static UPDATE_EXISTING_ORDER_PROXY_SERVICE: string = 'UpdateExistingOrderProxyService';
  static DELETE_ORDER_PROXY_SERVICE: string = 'DeleteOrderProxyService';

  static register(): DynamicModule {
    return {
      module: ProxyServicesDynamicModule,
      providers: [
        {
          inject: [InMemoryProductRepository, InMemoryClosingPeriodRepository, DatabaseOrderRepository, EmailOrderNotificationRepository],
          provide: ProxyServicesDynamicModule.ORDER_PRODUCTS_PROXY_SERVICE,
          useFactory: (
            inMemoryProductRepository: InMemoryProductRepository,
            inMemoryClosingPeriodRepository: InMemoryClosingPeriodRepository,
            databaseOrderRepository: DatabaseOrderRepository,
            emailOrderNotificationRepository: EmailOrderNotificationRepository
          ) =>
            new UseCaseProxy(
              new OrderProducts(inMemoryProductRepository, inMemoryClosingPeriodRepository, databaseOrderRepository, emailOrderNotificationRepository)
            ),
        },
        {
          inject: [InMemoryClosingPeriodRepository],
          provide: ProxyServicesDynamicModule.GET_CLOSING_PERIODS_PROXY_SERVICE,
          useFactory: (inMemoryClosingPeriodRepository: InMemoryClosingPeriodRepository) =>
            new UseCaseProxy(new GetClosingPeriods(inMemoryClosingPeriodRepository)),
        },
        {
          inject: [InMemoryProductRepository],
          provide: ProxyServicesDynamicModule.GET_PRODUCTS_PROXY_SERVICE,
          useFactory: (inMemoryProductRepository: InMemoryProductRepository) => new UseCaseProxy(new GetProducts(inMemoryProductRepository)),
        },
        {
          inject: [DatabaseOrderRepository],
          provide: ProxyServicesDynamicModule.GET_ORDERS_PROXY_SERVICE,
          useFactory: (databaseOrderRepository: DatabaseOrderRepository) => new UseCaseProxy(new GetOrders(databaseOrderRepository)),
        },
        {
          inject: [InMemoryProductRepository, InMemoryClosingPeriodRepository, DatabaseOrderRepository],
          provide: ProxyServicesDynamicModule.UPDATE_EXISTING_ORDER_PROXY_SERVICE,
          useFactory: (
            inMemoryProductRepository: InMemoryProductRepository,
            inMemoryClosingPeriodRepository: InMemoryClosingPeriodRepository,
            databaseOrderRepository: DatabaseOrderRepository
          ) => new UseCaseProxy(new UpdateExistingOrder(inMemoryProductRepository, inMemoryClosingPeriodRepository, databaseOrderRepository)),
        },
        {
          inject: [DatabaseOrderRepository],
          provide: ProxyServicesDynamicModule.DELETE_ORDER_PROXY_SERVICE,
          useFactory: (databaseOrderRepository: DatabaseOrderRepository) => new UseCaseProxy(new DeleteOrder(databaseOrderRepository)),
        },
      ],
      exports: [
        ProxyServicesDynamicModule.ORDER_PRODUCTS_PROXY_SERVICE,
        ProxyServicesDynamicModule.GET_CLOSING_PERIODS_PROXY_SERVICE,
        ProxyServicesDynamicModule.GET_PRODUCTS_PROXY_SERVICE,
        ProxyServicesDynamicModule.GET_ORDERS_PROXY_SERVICE,
        ProxyServicesDynamicModule.UPDATE_EXISTING_ORDER_PROXY_SERVICE,
        ProxyServicesDynamicModule.DELETE_ORDER_PROXY_SERVICE,
      ],
    };
  }
}
