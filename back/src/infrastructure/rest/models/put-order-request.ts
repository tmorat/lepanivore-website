import { ProductIdWithQuantity } from '../../../domain/product-with-quantity';

export interface PutOrderRequest {
  products: ProductIdWithQuantity[];
  type: string;
  pickUpDate?: string;
  deliveryDate?: string;
  deliveryAddress?: string;
  note?: string;
}
