import { ClosingPeriodInterface } from '../domain/closing-period.interface';
import { ClosingPeriodRepository } from '../domain/closing-period.repository';
import { NewOrderCommand } from '../domain/commands/new-order-command';
import { Order } from '../domain/order';
import { OrderNotification } from '../domain/order-notification';
import { OrderNotificationRepository } from '../domain/order-notification.repository';
import { OrderInterface } from '../domain/order.interface';
import { OrderRepository } from '../domain/order.repository';
import { ProductStatus } from '../domain/product-status';
import { ProductInterface } from '../domain/product.interface';
import { ProductRepository } from '../domain/product.repository';
import { OrderId } from '../domain/type-aliases';

export class OrderProducts {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly closingPeriodRepository: ClosingPeriodRepository,
    private readonly orderRepository: OrderRepository,
    private readonly orderNotificationRepository: OrderNotificationRepository
  ) {}

  async execute(newOrderCommand: NewOrderCommand): Promise<OrderId> {
    const order: OrderInterface = await this.createOrder(newOrderCommand);
    await this.sendOrderNotification(order);

    return order.id;
  }

  private async createOrder(newOrderCommand: NewOrderCommand): Promise<OrderInterface> {
    const activeProducts: ProductInterface[] = await this.productRepository.findAllByStatus(ProductStatus.ACTIVE);
    const closingPeriods: ClosingPeriodInterface[] = await this.closingPeriodRepository.findAll();

    const order: Order = Order.factory.create(newOrderCommand, activeProducts, closingPeriods);
    const orderId: OrderId = await this.orderRepository.save(order);

    return { ...order, id: orderId };
  }

  private async sendOrderNotification(order: OrderInterface): Promise<void> {
    const orderNotification: OrderNotification = OrderNotification.factory.create(order);
    await this.orderNotificationRepository.send(orderNotification);
  }
}
