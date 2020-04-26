import { OrderInterface } from '../domain/order.interface';
import { OrderRepository } from '../domain/order.repository';

export class GetOrders {
  constructor(private readonly orderRepository: OrderRepository) {}

  async execute(): Promise<OrderInterface[]> {
    return this.orderRepository.findAll();
  }
}
