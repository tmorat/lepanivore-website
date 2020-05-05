import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnvironmentConfigModule } from '../config/environment-config/environment-config.module';
import { MailerConfigModule } from '../config/mailer/mailer-config.module';
import { TypeOrmConfigModule } from '../config/typeorm/typeorm-config.module';
import { DatabaseClosingPeriodRepository } from './database-closing-period.repository';
import { DatabaseOrderRepository } from './database-order.repository';
import { DatabaseProductRepository } from './database-product.repository';
import { EmailOrderNotificationRepository } from './email-order-notification.repository';
import { ClosingPeriodEntityTransformer } from './entities/closing-period-entity.transformer';
import { ClosingPeriodEntity } from './entities/closing-period.entity';
import { OrderEntityTransformer } from './entities/order-entity.transformer';
import { OrderEntity } from './entities/order.entity';
import { ProductEntityTransformer } from './entities/product-entity.transformer';
import { ProductEntity } from './entities/product.entity';

@Module({
  imports: [
    TypeOrmConfigModule,
    TypeOrmModule.forFeature([OrderEntity, ProductEntity, ClosingPeriodEntity]),
    EnvironmentConfigModule,
    MailerConfigModule,
  ],
  providers: [
    DatabaseOrderRepository,
    DatabaseProductRepository,
    DatabaseClosingPeriodRepository,
    OrderEntityTransformer,
    ProductEntityTransformer,
    ClosingPeriodEntityTransformer,
    EmailOrderNotificationRepository,
  ],
  exports: [DatabaseOrderRepository, DatabaseProductRepository, DatabaseClosingPeriodRepository, EmailOrderNotificationRepository],
})
export class RepositoriesModule {}
