import { ClosingPeriodInterface } from '../../domain/closing-period.interface';
import { ClosingPeriodRepository } from '../../domain/closing-period.repository';
import { NewOrderCommand } from '../../domain/commands/new-order-command';
import { UpdateOrderCommand } from '../../domain/commands/update-order-command';
import { Order, OrderFactoryInterface } from '../../domain/order';
import { OrderNotification } from '../../domain/order-notification';
import { OrderNotificationRepository } from '../../domain/order-notification.repository';
import { OrderType } from '../../domain/order-type';
import { OrderInterface } from '../../domain/order.interface';
import { OrderRepository } from '../../domain/order.repository';
import { Product } from '../../domain/product';
import { ProductRepository } from '../../domain/product.repository';
import { OrderId } from '../../domain/type-aliases';
import { OrderProducts } from '../order-products';
import { UpdateExistingOrder } from '../update-existing-order';

describe('uses_cases/UpdateExistingOrder', () => {
  let updateExistingOrder: UpdateExistingOrder;
  let mockProductRepository: ProductRepository;
  let mockClosingPeriodRepository: ClosingPeriodRepository;
  let mockOrderRepository: OrderRepository;
  let updateOrderCommand: UpdateOrderCommand;
  let orderToUpdate: Order;

  beforeEach(() => {
    Order.factory = {} as OrderFactoryInterface;
    Order.factory.copy = jest.fn();

    orderToUpdate = { clientName: 'fake order' } as Order;
    orderToUpdate.updateWith = jest.fn();
    (Order.factory.copy as jest.Mock).mockReturnValue(orderToUpdate);

    mockProductRepository = {} as ProductRepository;
    mockProductRepository.findAll = jest.fn();

    mockClosingPeriodRepository = {} as ClosingPeriodRepository;
    mockClosingPeriodRepository.findAll = jest.fn();

    mockOrderRepository = {} as OrderRepository;
    mockOrderRepository.save = jest.fn();
    mockOrderRepository.findById = jest.fn();

    updateExistingOrder = new UpdateExistingOrder(mockProductRepository, mockClosingPeriodRepository, mockOrderRepository);

    updateOrderCommand = {
      orderId: 42,
      products: [{ productId: 42, quantity: 1 }],
      type: OrderType.DELIVERY,
      deliveryAddress: 'Laval',
    };
  });

  describe('execute()', () => {
    it('should search for existing order', async () => {
      // given
      updateOrderCommand.orderId = 1337;

      // when
      await updateExistingOrder.execute(updateOrderCommand);

      // then
      expect(mockOrderRepository.findById).toHaveBeenCalledWith(1337);
    });

    it('should copy found order in order to update it', async () => {
      // given
      const existingOrder: OrderInterface = { clientName: 'fake order' } as OrderInterface;
      (mockOrderRepository.findById as jest.Mock).mockReturnValue(Promise.resolve(existingOrder));

      // when
      await updateExistingOrder.execute(updateOrderCommand);

      // then
      expect(Order.factory.copy).toHaveBeenCalledWith(existingOrder);
    });

    it('should update existing order with command, all products, and closing periods', async () => {
      // given
      const allProducts: Product[] = [{ id: 42, name: 'Product 1' } as Product, { id: 1337, name: 'Product 2' } as Product];
      (mockProductRepository.findAll as jest.Mock).mockReturnValue(Promise.resolve(allProducts));

      const closingPeriods: ClosingPeriodInterface[] = [
        { start: new Date('2019-12-23T12:00:00.000Z'), end: new Date('2019-12-28T12:00:00.000Z') },
        { start: new Date('2020-07-15T12:00:00.000Z'), end: new Date('2020-08-15T12:00:00.000Z') },
      ];
      (mockClosingPeriodRepository.findAll as jest.Mock).mockReturnValue(Promise.resolve(closingPeriods));

      // when
      await updateExistingOrder.execute(updateOrderCommand);

      // then
      expect(orderToUpdate.updateWith).toHaveBeenCalledWith(updateOrderCommand, allProducts, closingPeriods);
    });

    it('should save updated order', async () => {
      // when
      await updateExistingOrder.execute(updateOrderCommand);

      // then
      expect(mockOrderRepository.save).toHaveBeenCalledWith(orderToUpdate);
    });
  });
});
