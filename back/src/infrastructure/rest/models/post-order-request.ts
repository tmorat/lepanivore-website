import { ProductIdWithQuantity } from '../../../domain/product-with-quantity';

export interface PostOrderRequest {
  clientName: string;
  clientPhoneNumber: string;
  clientEmailAddress: string;
  products: ProductIdWithQuantity[];
  type: string;
  pickUpDate?: string;
  deliveryAddress?: string;
}
