import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { AuthenticationModule } from '../config/authentication/authentication.module';
import { ProxyServicesDynamicModule } from '../use_cases_proxy/proxy-services-dynamic.module';
import { AuthenticationController } from './authentication.controller';
import { ClosingPeriodController } from './closing-period.controller';
import { InvalidOrderErrorFilter } from './filters/invalid-order-error.filter';
import { OrderNotFoundErrorFilter } from './filters/order-not-found-error.filter';
import { OrderController } from './order.controller';
import { ProductController } from './product.controller';

@Module({
  imports: [ProxyServicesDynamicModule.register(), AuthenticationModule],
  controllers: [OrderController, ClosingPeriodController, ProductController, AuthenticationController],
  providers: [
    { provide: APP_FILTER, useClass: InvalidOrderErrorFilter },
    { provide: APP_FILTER, useClass: OrderNotFoundErrorFilter },
  ],
})
export class RestModule {}
