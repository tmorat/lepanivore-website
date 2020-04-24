import { OrderInterface } from './order.interface';
import { OrderId } from './type-aliases';

export interface OrderRepository {
  save(order: OrderInterface): Promise<OrderId>;
  delete(order: OrderInterface): Promise<void>;
  findById(orderId: OrderId): Promise<OrderInterface>;
  findAll(): Promise<OrderInterface[]>;
}
