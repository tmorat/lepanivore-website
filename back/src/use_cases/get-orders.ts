import { Order } from '../domain/order';
import { OrderRepository } from '../domain/order.repository';

export class GetOrders {
  constructor(private readonly orderRepository: OrderRepository) {}

  async execute(): Promise<Order[]> {
    return this.orderRepository.findAll();
  }
}
