import { OrderNotification } from './order-notification';

export interface OrderNotificationRepository {
  send(orderNotification: OrderNotification): Promise<void>;
}
