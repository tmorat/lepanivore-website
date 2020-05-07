import { DeleteOrderCommand } from '../domain/order/commands/delete-order-command';
import { OrderInterface } from '../domain/order/order.interface';
import { OrderRepository } from '../domain/order/order.repository';

export class DeleteOrder {
  constructor(private readonly orderRepository: OrderRepository) {}

  async execute(deleteOrderCommand: DeleteOrderCommand): Promise<void> {
    const orderToDelete: OrderInterface = await this.orderRepository.findById(deleteOrderCommand.orderId);
    await this.orderRepository.delete(orderToDelete);
  }
}
