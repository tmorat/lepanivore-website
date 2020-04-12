import { Injectable } from '@nestjs/common';
import { ValueTransformer } from 'typeorm';
import { Order } from '../../../domain/order';
import { OrderType } from '../../../domain/order-type';
import { Product } from '../../../domain/product';
import { ProductWithQuantity } from '../../../domain/product-with-quantity';
import { OrderEntity } from './order.entity';

@Injectable()
export class OrderEntityTransformer implements ValueTransformer {
  private readonly PRODUCT_WITH_QUANTITY_SEPARATOR: string = ':::';

  from(orderEntity: OrderEntity): Order {
    const products: ProductWithQuantity[] = orderEntity.products.map(
      (productWithQuantityAsStringWithSeparator: string): ProductWithQuantity => {
        const productWithQuantityAsStringArray: string[] = productWithQuantityAsStringWithSeparator.split(this.PRODUCT_WITH_QUANTITY_SEPARATOR);

        return {
          product: JSON.parse(productWithQuantityAsStringArray[0]) as Product,
          quantity: parseInt(productWithQuantityAsStringArray[1], 10),
        };
      }
    );

    return {
      id: orderEntity.id,
      clientName: orderEntity.clientName,
      clientPhoneNumber: orderEntity.clientPhoneNumber,
      clientEmailAddress: orderEntity.clientEmailAddress,
      products,
      type: orderEntity.type as OrderType,
      pickUpDate: orderEntity.pickUpDate,
      deliveryAddress: orderEntity.deliveryAddress,
    };
  }

  to(order: Order): OrderEntity {
    const orderEntity: OrderEntity = new OrderEntity();
    orderEntity.id = order.id;
    orderEntity.clientName = order.clientName;
    orderEntity.clientPhoneNumber = order.clientPhoneNumber;
    orderEntity.clientEmailAddress = order.clientEmailAddress;
    orderEntity.products = order.products.map(
      (productWithQuantity: ProductWithQuantity) =>
        `${JSON.stringify(productWithQuantity.product)}${this.PRODUCT_WITH_QUANTITY_SEPARATOR}${productWithQuantity.quantity}`
    );
    orderEntity.type = order.type;
    orderEntity.pickUpDate = order.pickUpDate;
    orderEntity.deliveryAddress = order.deliveryAddress;

    return orderEntity;
  }
}
