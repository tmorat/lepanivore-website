import { ClosingPeriod } from '../domain/closing-period';
import { ClosingPeriodRepository } from '../domain/closing-period.repository';
import { NewOrderCommand } from '../domain/commands/new-order-command';
import { Order } from '../domain/order';
import { OrderNotification } from '../domain/order-notification';
import { OrderNotificationRepository } from '../domain/order-notification.repository';
import { OrderRepository } from '../domain/order.repository';
import { Product } from '../domain/product';
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
    const order: Order = await this.createOrder(newOrderCommand);
    await this.sendOrderNotification(order);

    return order.id;
  }

  private async createOrder(newOrderCommand: NewOrderCommand): Promise<Order> {
    const allProducts: Product[] = await this.productRepository.findAll();
    const closingPeriods: ClosingPeriod[] = await this.closingPeriodRepository.findAll();

    const order: Order = new Order(newOrderCommand, allProducts, closingPeriods);
    const orderId: OrderId = await this.orderRepository.save(order);

    return { ...order, id: orderId };
  }

  private async sendOrderNotification(order: Order): Promise<void> {
    const orderNotification: OrderNotification = new OrderNotification(order);
    await this.orderNotificationRepository.send(orderNotification);
  }
}
