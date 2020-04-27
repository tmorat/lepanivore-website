import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnvironmentConfigModule } from '../config/environment-config/environment-config.module';
import { MailerConfigModule } from '../config/mailer/mailer-config.module';
import { TypeOrmConfigModule } from '../config/typeorm/typeorm-config.module';
import { DatabaseOrderRepository } from './database-order.repository';
import { DatabaseProductRepository } from './database-product.repository';
import { EmailOrderNotificationRepository } from './email-order-notification.repository';
import { OrderEntityTransformer } from './entities/order-entity.transformer';
import { OrderEntity } from './entities/order.entity';
import { ProductEntityTransformer } from './entities/product-entity.transformer';
import { ProductEntity } from './entities/product.entity';
import { InMemoryClosingPeriodRepository } from './inmemory-closing-period.repository';

@Module({
  imports: [TypeOrmConfigModule, TypeOrmModule.forFeature([OrderEntity, ProductEntity]), EnvironmentConfigModule, MailerConfigModule],
  providers: [
    DatabaseOrderRepository,
    DatabaseProductRepository,
    InMemoryClosingPeriodRepository,
    OrderEntityTransformer,
    ProductEntityTransformer,
    EmailOrderNotificationRepository,
  ],
  exports: [DatabaseOrderRepository, DatabaseProductRepository, InMemoryClosingPeriodRepository, EmailOrderNotificationRepository],
})
export class RepositoriesModule {}
