import { OrderInterface } from '../domain/order/order.interface';
import { OrderRepository } from '../domain/order/order.repository';

export class GetOrders {
  constructor(private readonly orderRepository: OrderRepository) {}

  async execute(): Promise<OrderInterface[]> {
    return this.orderRepository.findAll();
  }
}
