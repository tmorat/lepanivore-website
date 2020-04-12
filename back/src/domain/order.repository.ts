import { Order } from './order';
import { OrderId } from './type-aliases';

export interface OrderRepository {
  save(order: Order): Promise<OrderId>;
  findAll(): Promise<Order[]>;
}
