import { OrderType } from '../../order/order-type';
import { OrderInterface } from '../../order/order.interface';
import { ProductInterface } from '../../product/product.interface';
import { OrderNotification } from '../order-notification';

describe('domain/order-notification/OrderNotification', () => {
  let order: OrderInterface;

  beforeEach(() => {
    order = {
      id: 42,
      clientName: 'John Doe',
      clientPhoneNumber: '+1 514 111 1111',
      clientEmailAddress: 'test@example.org',
      products: [
        { product: { id: 1, name: 'product 1', price: 1.11 } as ProductInterface, quantity: 1 },
        { product: { id: 2, name: 'product 2', price: 2.22 } as ProductInterface, quantity: 2 },
      ],
      type: OrderType.PICK_UP,
      pickUpDate: new Date('2020-06-13T04:41:20'),
      deliveryAddress: 'Montréal',
      deliveryDate: new Date('2030-06-13T04:41:20'),
      note: 'a note',
    };
  });

  describe('factory', () => {
    describe('create()', () => {
      describe('subject', () => {
        it('should create subject using order id', () => {
          // given
          order.id = 1337;

          // when
          const result: OrderNotification = OrderNotification.factory.create(order);

          // then
          expect(result.subject).toBe('Nouvelle commande en ligne: #1337');
        });
      });

      describe('body', () => {
        it('should create body using order details when order is pick-up', () => {
          // given
          order.type = OrderType.PICK_UP;

          // when
          const result: OrderNotification = OrderNotification.factory.create(order);

          // then
          expect(result.body).toBe(
            'Bonjour,\n' +
              '\n' +
              'Une nouvelle commande (#42) a été passée en ligne !\n' +
              '\n' +
              'Informations de contact :\n' +
              '- Nom du client : John Doe\n' +
              '- Numéro de téléphone du client : +1 514 111 1111\n' +
              '- Courriel du client : test@example.org\n' +
              '\n' +
              '- Numéro de commande : #42\n' +
              '- Type de commande : Cueillette\n' +
              '- Date de cueillette : 2020-06-13\n' +
              '- Produits :\n' +
              '  - product 1 : 1\n' +
              '  - product 2 : 2\n' +
              '- Note : a note'
          );
        });

        it('should create body using order details when order is delivery', () => {
          // given
          order.type = OrderType.DELIVERY;

          // when
          const result: OrderNotification = OrderNotification.factory.create(order);

          // then
          expect(result.body).toBe(
            'Bonjour,\n' +
              '\n' +
              'Une nouvelle commande (#42) a été passée en ligne !\n' +
              '\n' +
              'Informations de contact :\n' +
              '- Nom du client : John Doe\n' +
              '- Numéro de téléphone du client : +1 514 111 1111\n' +
              '- Courriel du client : test@example.org\n' +
              '\n' +
              '- Numéro de commande : #42\n' +
              '- Type de commande : Livraison\n' +
              '- Date de livraison : 2030-06-13\n' +
              '- Adresse de livraison : Montréal\n' +
              '- Produits :\n' +
              '  - product 1 : 1\n' +
              '  - product 2 : 2\n' +
              '- Note : a note'
          );
        });
      });
    });
  });
});
