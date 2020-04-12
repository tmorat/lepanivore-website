import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../../domain/order';
import { OrderRepository } from '../../domain/order.repository';
import { OrderId } from '../../domain/type-aliases';
import { OrderEntityTransformer } from './entities/order-entity.transformer';
import { OrderEntity } from './entities/order.entity';

@Injectable()
export class DatabaseOrderRepository implements OrderRepository {
  constructor(
    @InjectRepository(OrderEntity) private readonly orderEntityRepository: Repository<OrderEntity>,
    private readonly orderEntityTransformer: OrderEntityTransformer
  ) {}

  async save(order: Order): Promise<OrderId> {
    const orderEntity: OrderEntity = this.orderEntityTransformer.to(order);
    const savedOrderEntity: OrderEntity = await this.orderEntityRepository.save(orderEntity);

    return Promise.resolve(savedOrderEntity.id);
  }

  async findAll(): Promise<Order[]> {
    const foundOrderEntities: OrderEntity[] = await this.orderEntityRepository.find();
    const result: Order[] = foundOrderEntities.map((orderEntity: OrderEntity) => this.orderEntityTransformer.from(orderEntity));

    return Promise.resolve(result);
  }
}
