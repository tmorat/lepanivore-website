import { OrderType } from '../order-type';
import { ProductIdWithQuantity } from '../product-with-quantity';

export interface NewOrderCommand {
  clientName: string;
  clientPhoneNumber: string;
  clientEmailAddress: string;
  products: ProductIdWithQuantity[];
  type: OrderType;
  pickUpDate?: Date;
  deliveryAddress?: string;
}
