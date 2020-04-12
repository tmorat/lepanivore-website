import { ClosingPeriod } from '../closing-period';
import { NewOrderCommand } from '../commands/new-order-command';
import { InvalidOrderError } from '../invalid-order.error';
import { Order } from '../order';
import { OrderType } from '../order-type';
import { Product } from '../product';

describe('domain/Order', () => {
  describe('constructor()', () => {
    let newOrderCommand: NewOrderCommand;
    let allProducts: Product[];
    let closingPeriods: ClosingPeriod[];
    let realDateConstructor: DateConstructor;

    beforeAll(() => {
      realDateConstructor = Date;
    });

    beforeEach(() => {
      global.Date = realDateConstructor;

      newOrderCommand = {
        clientName: 'John Doe',
        clientPhoneNumber: '514-123-4567',
        clientEmailAddress: 'test@example.org',
        products: [{ productId: 42, quantity: 1 }],
        type: OrderType.DELIVERY,
        pickUpDate: new Date('2030-01-01T12:00:00Z'),
        deliveryAddress: 'Montréal',
      };
      allProducts = [{ id: 42, name: 'fake product' } as Product];
      closingPeriods = [];
    });

    describe('id', () => {
      it('should initialize with no id', () => {
        // when
        const result: Order = new Order(newOrderCommand, allProducts, closingPeriods);

        // then
        expect(result.id).toBeUndefined();
      });
    });

    describe('clientName', () => {
      it('should bind client name from command', () => {
        // given
        newOrderCommand.clientName = 'Harry Potter';

        // when
        const result: Order = new Order(newOrderCommand, allProducts, closingPeriods);

        // then
        expect(result.clientName).toBe('Harry Potter');
      });

      it('should fail when client name is empty', () => {
        // given
        newOrderCommand.clientName = '';

        // when
        const result = () => new Order(newOrderCommand, allProducts, closingPeriods);

        // then
        expect(result).toThrow(new InvalidOrderError('client name must be defined'));
      });
    });

    describe('clientPhoneNumber', () => {
      it('should bind client phone number from command', () => {
        // given
        newOrderCommand.clientPhoneNumber = '+1-514-987-6543';

        // when
        const result: Order = new Order(newOrderCommand, allProducts, closingPeriods);

        // then
        expect(result.clientPhoneNumber).toBe('+1-514-987-6543');
      });

      it('should fail when client phone number is empty', () => {
        // given
        newOrderCommand.clientPhoneNumber = '';

        // when
        const result = () => new Order(newOrderCommand, allProducts, closingPeriods);

        // then
        expect(result).toThrow(new InvalidOrderError('client phone number must be defined'));
      });
    });

    describe('clientEmailAddress', () => {
      it('should bind client email address from command', () => {
        // given
        newOrderCommand.clientEmailAddress = 'test@example.org';

        // when
        const result: Order = new Order(newOrderCommand, allProducts, closingPeriods);

        // then
        expect(result.clientEmailAddress).toBe('test@example.org');
      });

      it('should fail when client email address is empty', () => {
        // given
        newOrderCommand.clientEmailAddress = '';

        // when
        const result = () => new Order(newOrderCommand, allProducts, closingPeriods);

        // then
        expect(result).toThrow(new InvalidOrderError('client email address must be defined'));
      });

      it('should fail when client email address is not a valid email', () => {
        // given
        newOrderCommand.clientEmailAddress = 'not-a-valid-email';

        // when
        const result = () => new Order(newOrderCommand, allProducts, closingPeriods);

        // then
        expect(result).toThrow(new InvalidOrderError('invalid client email address'));
      });
    });

    describe('products', () => {
      it('should bind products using product ids from command and all products list', () => {
        // given
        newOrderCommand.products = [
          { productId: 42, quantity: 1 },
          { productId: 1337, quantity: 2 },
        ];

        const product1: Product = new Product();
        product1.id = 42;
        product1.name = 'Product 1';

        const product2: Product = new Product();
        product2.id = 1337;
        product2.name = 'Product 2';

        allProducts = [product1, product2];

        // when
        const result: Order = new Order(newOrderCommand, allProducts, closingPeriods);

        // then
        expect(result.products).toStrictEqual([
          { product: product1, quantity: 1 },
          { product: product2, quantity: 2 },
        ]);
      });

      it('should fail when product list is empty', () => {
        // given
        newOrderCommand.products = [];

        // when
        const result = () => new Order(newOrderCommand, allProducts, closingPeriods);

        // then
        expect(result).toThrow(new InvalidOrderError('an order must have at least one product'));
      });

      it('should fail when having a product with zero quantity', () => {
        // given
        newOrderCommand.products = [
          { productId: 42, quantity: 0 },
          { productId: 1337, quantity: 2 },
        ];

        // when
        const result = () => new Order(newOrderCommand, allProducts, closingPeriods);

        // then
        expect(result).toThrow(new InvalidOrderError('a product quantity must be positive'));
      });

      it('should fail when having a product with negative quantity', () => {
        // given
        newOrderCommand.products = [
          { productId: 42, quantity: 1 },
          { productId: 1337, quantity: -1 },
        ];

        // when
        const result = () => new Order(newOrderCommand, allProducts, closingPeriods);

        // then
        expect(result).toThrow(new InvalidOrderError('a product quantity must be positive'));
      });

      it('should fail when having an unknown product id', () => {
        // given
        newOrderCommand.products = [
          { productId: 42, quantity: 1 },
          { productId: 1337, quantity: 2 },
        ];

        const product1: Product = new Product();
        product1.id = 42;
        product1.name = 'Product 1';
        allProducts = [product1];

        // when
        const result = () => new Order(newOrderCommand, allProducts, closingPeriods);

        // then
        expect(result).toThrow(new InvalidOrderError('product with id 1337 not found'));
      });
    });

    describe('type', () => {
      it('should bind type from command', () => {
        // given
        newOrderCommand.type = OrderType.DELIVERY;

        // when
        const result: Order = new Order(newOrderCommand, allProducts, closingPeriods);

        // then
        expect(result.type).toBe(OrderType.DELIVERY);
      });

      it('should fail when no type', () => {
        // given
        newOrderCommand.type = undefined;

        // when
        const result = () => new Order(newOrderCommand, allProducts, closingPeriods);

        // then
        expect(result).toThrow(new InvalidOrderError('order type must be defined'));
      });

      it('should fail when unknown type', () => {
        // given
        newOrderCommand.type = 'UNKNOWN_TYPE' as OrderType;

        // when
        const result = () => new Order(newOrderCommand, allProducts, closingPeriods);

        // then
        expect(result).toThrow(new InvalidOrderError('unknown order type'));
      });
    });

    describe('pickUpDate', () => {
      let now: Date;
      let nowMinusOneDay: Date;
      let nowPlusOneDay: Date;
      let nowPlusTwoDays: Date;
      let aSundayInTheFuture: Date;
      let aMondayInTheFuture: Date;

      beforeEach(() => {
        now = new Date('2020-06-03T04:41:20');
        nowMinusOneDay = new Date('2020-06-02T04:41:20');
        nowPlusOneDay = new Date('2020-06-04T04:41:20');
        nowPlusTwoDays = new Date('2020-06-05T04:41:20');
        aSundayInTheFuture = new Date('2030-03-31T04:41:20');
        aMondayInTheFuture = new Date('2030-04-01T04:41:20');
        // @ts-ignore
        jest.spyOn(global, 'Date').mockImplementationOnce(() => now);

        newOrderCommand.type = OrderType.PICK_UP;
      });

      it('should bind pick-up date from command', () => {
        // given
        newOrderCommand.pickUpDate = nowPlusTwoDays;

        // when
        const result: Order = new Order(newOrderCommand, allProducts, closingPeriods);

        // then
        expect(result.pickUpDate).toBe(nowPlusTwoDays);
      });

      it('should not bind any pick-up date from command when order type is delivery', () => {
        // given
        newOrderCommand.pickUpDate = nowPlusTwoDays;
        newOrderCommand.type = OrderType.DELIVERY;

        // when
        const result: Order = new Order(newOrderCommand, allProducts, closingPeriods);

        // then
        expect(result.pickUpDate).toBeUndefined();
      });

      it('should fail when no pick-up date and order type is pick-up', () => {
        // given
        newOrderCommand.pickUpDate = null;

        // when
        const result = () => new Order(newOrderCommand, allProducts, closingPeriods);

        // then
        expect(result).toThrow(new InvalidOrderError('a pick-up date must be defined when order type is pick-up'));
      });

      it('should fail when pick-up date is in the past', () => {
        // given
        newOrderCommand.pickUpDate = nowMinusOneDay;

        // when
        const result = () => new Order(newOrderCommand, allProducts, closingPeriods);

        // then
        expect(result).toThrow(new InvalidOrderError('pick-up date has to be at least two days after now'));
      });

      it('should fail when pick-up date is same as now', () => {
        // given
        newOrderCommand.pickUpDate = now;

        // when
        const result = () => new Order(newOrderCommand, allProducts, closingPeriods);

        // then
        expect(result).toThrow(new InvalidOrderError('pick-up date has to be at least two days after now'));
      });

      it('should fail when pick-up date is tomorrow', () => {
        // given
        newOrderCommand.pickUpDate = nowPlusOneDay;

        // when
        const result = () => new Order(newOrderCommand, allProducts, closingPeriods);

        // then
        expect(result).toThrow(new InvalidOrderError('pick-up date has to be at least two days after now'));
      });

      it('should fail when pick-up date is a Sunday', () => {
        // given
        newOrderCommand.pickUpDate = aSundayInTheFuture;

        // when
        const result = () => new Order(newOrderCommand, allProducts, closingPeriods);

        // then
        expect(result).toThrow(new InvalidOrderError('pick-up date must be between a Tuesday and a Saturday'));
      });

      it('should fail when pick-up date is a Monday', () => {
        // given
        newOrderCommand.pickUpDate = aMondayInTheFuture;

        // when
        const result = () => new Order(newOrderCommand, allProducts, closingPeriods);

        // then
        expect(result).toThrow(new InvalidOrderError('pick-up date must be between a Tuesday and a Saturday'));
      });

      it('should fail when pick-up date is in a closing period', () => {
        // given
        closingPeriods = [
          { start: aSundayInTheFuture, end: aMondayInTheFuture },
          { start: nowMinusOneDay, end: nowPlusTwoDays },
        ];
        newOrderCommand.pickUpDate = nowPlusTwoDays;

        // when
        const result = () => new Order(newOrderCommand, allProducts, closingPeriods);

        // then
        expect(result).toThrow(new InvalidOrderError('pick-up date must be outside closing periods'));
      });

      it('should not fail when pick-up date is outside closing periods', () => {
        // given
        closingPeriods = [
          { start: aSundayInTheFuture, end: aMondayInTheFuture },
          { start: nowMinusOneDay, end: nowPlusOneDay },
        ];
        newOrderCommand.pickUpDate = nowPlusTwoDays;

        // when
        const result = () => new Order(newOrderCommand, allProducts, closingPeriods);

        // then
        expect(result).not.toThrow();
      });
    });

    describe('deliveryAddress', () => {
      beforeEach(() => {
        newOrderCommand.type = OrderType.DELIVERY;
      });

      it('should bind delivery address from command', () => {
        // given
        newOrderCommand.deliveryAddress = '1224 Rue Bélanger, Montréal, QC H2S 1H8';

        // when
        const result: Order = new Order(newOrderCommand, allProducts, closingPeriods);

        // then
        expect(result.deliveryAddress).toBe('1224 Rue Bélanger, Montréal, QC H2S 1H8');
      });

      it('should not bind any delivery address from command when order type is pick-up', () => {
        // given
        newOrderCommand.deliveryAddress = '1224 Rue Bélanger, Montréal, QC H2S 1H8';
        newOrderCommand.type = OrderType.PICK_UP;

        // when
        const result: Order = new Order(newOrderCommand, allProducts, closingPeriods);

        // then
        expect(result.deliveryAddress).toBeUndefined();
      });

      it('should fail when delivery address is empty and order type is delivery', () => {
        // given
        newOrderCommand.deliveryAddress = '';

        // when
        const result = () => new Order(newOrderCommand, allProducts, closingPeriods);

        // then
        expect(result).toThrow(new InvalidOrderError('a delivery address must be defined when order type is delivery'));
      });
    });
  });
});
