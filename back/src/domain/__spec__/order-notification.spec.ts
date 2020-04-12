import { OrderNotification } from '../order-notification';
import { Order } from '../order';
import { OrderType } from '../order-type';

describe('domain/OrderNotification', () => {
  let order: Order;

  beforeEach(() => {
    order = {
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
  });

  describe('constructor()', () => {
    describe('recipient', () => {
      it('should bind order client email address to recipient', () => {
        // given
        order.clientEmailAddress = 'client@example.org';

        // when
        const result: OrderNotification = new OrderNotification(order);

        // then
        expect(result.recipient).toBe('client@example.org');
      });
    });

    describe('subject', () => {
      it('should create subject using order id', () => {
        // given
        order.id = 1337;

        // when
        const result: OrderNotification = new OrderNotification(order);

        // then
        expect(result.subject).toBe('Boulangerie Le Panivore : votre commande #1337');
      });
    });

    describe('body', () => {
      it('should create body using order details', () => {
        // when
        const result: OrderNotification = new OrderNotification(order);

        // then
        expect(result.body).toBe(
          'Bonjour,\n' +
            '\n' +
            'Voici le récapitulatif de votre commande :\n' +
            '- Numéro de commande: 42\n' +
            '- Votre nom: John Doe\n' +
            '- Votre numéro de téléphone: +1 514 111 1111\n' +
            '- Type de commande: Cueillette\n' +
            '- Date de cueillette : 2020-06-13\n' +
            '- Produits :\n' +
            '  - product 1 (1.11$) : 1\n' +
            '  - product 2 (2.22$) : 2\n' +
            '- Prix total : 5.55$\n' +
            '\n' +
            "Merci d'avoir commandé et à très bientôt !"
        );
      });
    });
  });
});
