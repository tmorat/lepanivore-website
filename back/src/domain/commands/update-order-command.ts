import { OrderType } from '../order-type';
import { ProductIdWithQuantity } from '../product-with-quantity';
import { OrderId } from '../type-aliases';

export interface UpdateOrderCommand {
  orderId: OrderId;
  products: ProductIdWithQuantity[];
  type: OrderType;
  pickUpDate?: Date;
  deliveryDate?: Date;
  deliveryAddress?: string;
}
