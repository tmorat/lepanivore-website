import { ClosingPeriodInterface } from '../domain/closing-period.interface';
import { ClosingPeriodRepository } from '../domain/closing-period.repository';
import { UpdateOrderCommand } from '../domain/commands/update-order-command';
import { Order } from '../domain/order';
import { OrderInterface } from '../domain/order.interface';
import { OrderRepository } from '../domain/order.repository';
import { ProductStatus } from '../domain/product-status';
import { ProductInterface } from '../domain/product.interface';
import { ProductRepository } from '../domain/product.repository';

export class UpdateExistingOrder {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly closingPeriodRepository: ClosingPeriodRepository,
    private readonly orderRepository: OrderRepository
  ) {}

  async execute(updateOrderCommand: UpdateOrderCommand): Promise<void> {
    const activeProducts: ProductInterface[] = await this.productRepository.findAllByStatus(ProductStatus.ACTIVE);
    const closingPeriods: ClosingPeriodInterface[] = await this.closingPeriodRepository.findAll();

    const foundOrder: OrderInterface = await this.orderRepository.findById(updateOrderCommand.orderId);
    const orderToUpdate: Order = Order.factory.copy(foundOrder);
    orderToUpdate.updateWith(updateOrderCommand, activeProducts, closingPeriods);
    await this.orderRepository.save(orderToUpdate);
  }
}
