import { ClosingPeriod } from '../../domain/closing-period';
import { ClosingPeriodRepository } from '../../domain/closing-period.repository';
import { NewOrderCommand } from '../../domain/commands/new-order-command';
import { Order } from '../../domain/order';
import { OrderNotification } from '../../domain/order-notification';
import { OrderNotificationRepository } from '../../domain/order-notification.repository';
import { OrderType } from '../../domain/order-type';
import { OrderRepository } from '../../domain/order.repository';
import { Product } from '../../domain/product';
import { ProductRepository } from '../../domain/product.repository';
import { OrderId } from '../../domain/type-aliases';
import { OrderProducts } from '../order-products';

jest.mock('../../domain/order');
jest.mock('../../domain/order-notification');

describe('uses_cases/OrderProducts', () => {
  let orderProducts: OrderProducts;
  let mockProductRepository: ProductRepository;
  let mockClosingPeriodRepository: ClosingPeriodRepository;
  let mockOrderRepository: OrderRepository;
  let mockOrderNotificationRepository: OrderNotificationRepository;
  let newOrderCommand: NewOrderCommand;

  beforeEach(() => {
    ((Order as unknown) as jest.Mock).mockClear();
    ((OrderNotification as unknown) as jest.Mock).mockClear();

    mockProductRepository = {} as ProductRepository;
    mockProductRepository.findAll = jest.fn();

    mockClosingPeriodRepository = {} as ClosingPeriodRepository;
    mockClosingPeriodRepository.findAll = jest.fn();

    mockOrderRepository = {} as OrderRepository;
    mockOrderRepository.save = jest.fn();

    mockOrderNotificationRepository = {} as OrderNotificationRepository;
    mockOrderNotificationRepository.send = jest.fn();

    orderProducts = new OrderProducts(mockProductRepository, mockClosingPeriodRepository, mockOrderRepository, mockOrderNotificationRepository);

    newOrderCommand = {
      clientName: 'John Doe',
      clientPhoneNumber: '514-123-4567',
      clientEmailAddress: 'test@example.org',
      products: [{ productId: 42, quantity: 1 }],
      type: OrderType.DELIVERY,
      deliveryAddress: 'Montréal',
    };
  });

  describe('execute()', () => {
    it('should create new order using given command, all products, and closing periods', async () => {
      // given
      const allProducts: Product[] = [{ id: 42, name: 'Product 1' } as Product, { id: 1337, name: 'Product 2' } as Product];
      (mockProductRepository.findAll as jest.Mock).mockReturnValue(Promise.resolve(allProducts));

      const closingPeriods: ClosingPeriod[] = [
        { start: new Date('2019-12-23T12:00:00.000Z'), end: new Date('2019-12-28T12:00:00.000Z') },
        { start: new Date('2020-07-15T12:00:00.000Z'), end: new Date('2020-08-15T12:00:00.000Z') },
      ];
      (mockClosingPeriodRepository.findAll as jest.Mock).mockReturnValue(Promise.resolve(closingPeriods));

      // when
      await orderProducts.execute(newOrderCommand);

      // then
      expect(Order).toHaveBeenCalledWith(newOrderCommand, allProducts, closingPeriods);
    });

    it('should save created order using repository', async () => {
      // given
      const createdOrder: Order = { clientName: 'Fake order' } as Order;
      ((Order as unknown) as jest.Mock).mockImplementation(() => createdOrder);

      // when
      await orderProducts.execute(newOrderCommand);

      // then
      expect(mockOrderRepository.save).toHaveBeenCalledWith(createdOrder);
    });

    it('should create order notification with order details, id, and store email address', async () => {
      // given
      const createdOrder: Order = { clientName: 'Fake order' } as Order;
      ((Order as unknown) as jest.Mock).mockImplementation(() => createdOrder);

      const savedOrderId: OrderId = 42;
      (mockOrderRepository.save as jest.Mock).mockReturnValue(Promise.resolve(savedOrderId));

      // when
      await orderProducts.execute(newOrderCommand);

      // then
      expect(OrderNotification).toHaveBeenCalledWith({ id: 42, clientName: 'Fake order' } as Order);
    });

    it('should send created order notification', async () => {
      // given
      const createdOrderNotification: OrderNotification = { recipient: 'test@example.org' } as OrderNotification;
      ((OrderNotification as unknown) as jest.Mock).mockImplementation(() => createdOrderNotification);

      // when
      await orderProducts.execute(newOrderCommand);

      // then
      expect(mockOrderNotificationRepository.send).toHaveBeenCalledWith(createdOrderNotification);
    });

    it('should return saved order id from repository', async () => {
      // given
      const savedOrderId: OrderId = 42;
      (mockOrderRepository.save as jest.Mock).mockReturnValue(Promise.resolve(savedOrderId));

      // when
      const result: OrderId = await orderProducts.execute(newOrderCommand);

      // then
      expect(result).toBe(savedOrderId);
    });
  });
});
