import { ProductIdWithQuantity } from '../../../domain/product-with-quantity';

export interface PutOrderRequest {
  products: ProductIdWithQuantity[];
  type: string;
  pickUpDate?: string;
  deliveryAddress?: string;
}
