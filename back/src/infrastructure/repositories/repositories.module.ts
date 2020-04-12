import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnvironmentConfigModule } from '../config/environment-config/environment-config.module';
import { MailerConfigModule } from '../config/mailer/mailer-config.module';
import { TypeOrmConfigModule } from '../config/typeorm/typeorm-config.module';
import { DatabaseOrderRepository } from './database-order.repository';
import { EmailOrderNotificationRepository } from './email-order-notification.repository';
import { OrderEntityTransformer } from './entities/order-entity.transformer';
import { OrderEntity } from './entities/order.entity';
import { InMemoryClosingPeriodRepository } from './inmemory-closing-period.repository';
import { InMemoryProductRepository } from './inmemory-product.repository';

@Module({
  imports: [TypeOrmConfigModule, TypeOrmModule.forFeature([OrderEntity]), EnvironmentConfigModule, MailerConfigModule],
  providers: [
    DatabaseOrderRepository,
    InMemoryProductRepository,
    InMemoryClosingPeriodRepository,
    OrderEntityTransformer,
    EmailOrderNotificationRepository,
  ],
  exports: [DatabaseOrderRepository, InMemoryProductRepository, InMemoryClosingPeriodRepository, EmailOrderNotificationRepository],
})
export class RepositoriesModule {}
