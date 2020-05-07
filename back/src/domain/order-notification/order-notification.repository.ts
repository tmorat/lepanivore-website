import { OrderNotificationInterface } from './order-notification.interface';

export interface OrderNotificationRepository {
  send(orderNotification: OrderNotificationInterface): Promise<void>;
}
