import { Order } from '../../../../domain/order';
import { OrderType } from '../../../../domain/order-type';
import { OrderInterface } from '../../../../domain/order.interface';
import { OrderEntityTransformer } from '../order-entity.transformer';
import { OrderEntity } from '../order.entity';

describe('infrastructure/repositories/entities/OrderEntityTransformer', () => {
  let orderEntityTransformer: OrderEntityTransformer;
  beforeEach(() => {
    orderEntityTransformer = new OrderEntityTransformer();
  });

  describe('from()', () => {
    it('should transform OrderEntity to Order', () => {
      // given
      const orderEntity: OrderEntity = {
        id: 42,
        clientName: 'John Doe',
        clientEmailAddress: 'test@example.org',
        clientPhoneNumber: '+1 514 111 1111',
        products: [
          '{"id":1,"name":"product 1","description":"product 1 description","price":1.11}:::1',
          '{"id":2,"name":"product 2","description":"product 2 description","price":2.22}:::2',
        ],
        type: 'PICK_UP',
        pickUpDate: new Date('2020-06-13T04:41:20'),
        deliveryAddress: 'Montréal',
      } as OrderEntity;

      // when
      const result: OrderInterface = orderEntityTransformer.from(orderEntity);

      // then
      expect(result).toStrictEqual({
        id: 42,
        clientName: 'John Doe',
        clientPhoneNumber: '+1 514 111 1111',
        clientEmailAddress: 'test@example.org',
        products: [
          { product: { id: 1, name: 'product 1', description: 'product 1 description', price: 1.11 }, quantity: 1 },
          { product: { id: 2, name: 'product 2', description: 'product 2 description', price: 2.22 }, quantity: 2 },
        ],
        type: OrderType.PICK_UP,
        pickUpDate: new Date('2020-06-13T04:41:20'),
        deliveryAddress: 'Montréal',
      } as Order);
    });
  });

  describe('to()', () => {
    it('should transform Order to OrderEntity', () => {
      // given
      const order: OrderInterface = {
        id: 42,
        clientName: 'John Doe',
        clientPhoneNumber: '+1 514 111 1111',
        clientEmailAddress: 'test@example.org',
        products: [
          { product: { id: 1, name: 'product 1', description: 'product 1 description', price: 1.11 }, quantity: 1 },
          { product: { id: 2, name: 'product 2', description: 'product 2 description', price: 2.22 }, quantity: 2 },
        ],
        type: OrderType.PICK_UP,
        pickUpDate: new Date('2020-06-13T04:41:20'),
        deliveryAddress: 'Montréal',
      };

      // when
      const result: OrderEntity = orderEntityTransformer.to(order);

      // then
      expect(result).toMatchObject({
        id: 42,
        clientName: 'John Doe',
        clientEmailAddress: 'test@example.org',
        clientPhoneNumber: '+1 514 111 1111',
        products: [
          '{"id":1,"name":"product 1","description":"product 1 description","price":1.11}:::1',
          '{"id":2,"name":"product 2","description":"product 2 description","price":2.22}:::2',
        ],
        type: 'PICK_UP',
        pickUpDate: new Date('2020-06-13T04:41:20'),
        deliveryAddress: 'Montréal',
      } as OrderEntity);
    });
  });
});
