import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { RavenInterceptor, RavenModule } from 'nest-raven';
import { AuthenticationModule } from '../config/authentication/authentication.module';
import { ProxyServicesDynamicModule } from '../use_cases_proxy/proxy-services-dynamic.module';
import { AuthenticationController } from './authentication.controller';
import { ClosingPeriodController } from './closing-period.controller';
import { ClosingPeriodNotFoundErrorFilter } from './filters/closing-period-not-found-error.filter';
import { FeatureNotFoundErrorFilter } from './filters/feature-not-found-error.filter';
import { InvalidClosingPeriodErrorFilter } from './filters/invalid-closing-period-error.filter';
import { InvalidOrderErrorFilter } from './filters/invalid-order-error.filter';
import { InvalidProductErrorFilter } from './filters/invalid-product-error.filter';
import { OrderNotFoundErrorFilter } from './filters/order-not-found-error.filter';
import { ProductNotFoundErrorFilter } from './filters/product-not-found-error.filter';
import { ProductOrderingDisabledErrorFilter } from './filters/product-ordering-disabled-error.filter';
import { OrderController } from './order.controller';
import { ProductOrderingController } from './product-ordering.controller';
import { ProductController } from './product.controller';

@Module({
  imports: [ProxyServicesDynamicModule.register(), AuthenticationModule, RavenModule],
  controllers: [
    OrderController,
    ClosingPeriodController,
    ProductController,
    AuthenticationController,
    ClosingPeriodController,
    ProductOrderingController,
  ],
  providers: [
    { provide: APP_INTERCEPTOR, useValue: new RavenInterceptor() },
    { provide: APP_FILTER, useClass: InvalidOrderErrorFilter },
    { provide: APP_FILTER, useClass: OrderNotFoundErrorFilter },
    { provide: APP_FILTER, useClass: InvalidProductErrorFilter },
    { provide: APP_FILTER, useClass: ProductNotFoundErrorFilter },
    { provide: APP_FILTER, useClass: InvalidClosingPeriodErrorFilter },
    { provide: APP_FILTER, useClass: ClosingPeriodNotFoundErrorFilter },
    { provide: APP_FILTER, useClass: FeatureNotFoundErrorFilter },
    { provide: APP_FILTER, useClass: ProductOrderingDisabledErrorFilter },
  ],
})
export class RestModule {}
