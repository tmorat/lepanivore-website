import { ClosingPeriodInterface } from '../domain/closing-period.interface';
import { ClosingPeriodRepository } from '../domain/closing-period.repository';
import { UpdateOrderCommand } from '../domain/commands/update-order-command';
import { Order } from '../domain/order';
import { OrderInterface } from '../domain/order.interface';
import { OrderRepository } from '../domain/order.repository';
import { Product } from '../domain/product';
import { ProductRepository } from '../domain/product.repository';

export class UpdateExistingOrder {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly closingPeriodRepository: ClosingPeriodRepository,
    private readonly orderRepository: OrderRepository
  ) {}

  async execute(updateOrderCommand: UpdateOrderCommand): Promise<void> {
    const allProducts: Product[] = await this.productRepository.findAll();
    const closingPeriods: ClosingPeriodInterface[] = await this.closingPeriodRepository.findAll();

    const foundOrder: OrderInterface = await this.orderRepository.findById(updateOrderCommand.orderId);
    const orderToUpdate: Order = Order.factory.copy(foundOrder);
    orderToUpdate.updateWith(updateOrderCommand, allProducts, closingPeriods);
    await this.orderRepository.save(orderToUpdate);
  }
}
