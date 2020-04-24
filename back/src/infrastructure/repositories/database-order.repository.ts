import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../../domain/order';
import { OrderNotFoundError } from '../../domain/order-not-found.error';
import { OrderInterface } from '../../domain/order.interface';
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

  async save(order: OrderInterface): Promise<OrderId> {
    const orderEntity: OrderEntity = this.orderEntityTransformer.to(order);
    const savedOrderEntity: OrderEntity = await this.orderEntityRepository.save(orderEntity);

    return Promise.resolve(savedOrderEntity.id);
  }

  async delete(order: OrderInterface): Promise<void> {
    await this.orderEntityRepository.delete(order.id);
  }

  async findById(orderId: OrderId): Promise<OrderInterface> {
    const foundOrderEntity: OrderEntity = await this.orderEntityRepository.findOne({ where: { id: orderId } });
    if (!foundOrderEntity) {
      return Promise.reject(new OrderNotFoundError(`Order not found with id "${orderId}"`));
    }

    return Promise.resolve(this.orderEntityTransformer.from(foundOrderEntity));
  }

  async findAll(): Promise<OrderInterface[]> {
    const foundOrderEntities: OrderEntity[] = await this.orderEntityRepository.find();
    const result: OrderInterface[] = foundOrderEntities.map((orderEntity: OrderEntity) => this.orderEntityTransformer.from(orderEntity));

    return Promise.resolve(result);
  }
}
