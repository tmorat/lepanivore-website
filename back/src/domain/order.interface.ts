import { OrderType } from './order-type';
import { ProductWithQuantity } from './product-with-quantity';
import { OrderId } from './type-aliases';

export interface OrderInterface {
  id: OrderId;
  clientName: string;
  clientPhoneNumber: string;
  clientEmailAddress: string;
  products: ProductWithQuantity[];
  type: OrderType;
  pickUpDate?: Date;
  deliveryAddress?: string;
}
