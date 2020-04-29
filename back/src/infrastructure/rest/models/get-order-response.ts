import { OrderType } from '../../../domain/order-type';
import { ProductWithQuantity } from '../../../domain/product-with-quantity';
import { OrderId } from '../../../domain/type-aliases';

export interface GetOrderResponse {
  id: OrderId;
  clientName: string;
  clientPhoneNumber: string;
  clientEmailAddress: string;
  products: ProductWithQuantity[];
  type: OrderType;
  pickUpDate?: string;
  deliveryDate?: string;
  deliveryAddress?: string;
}
