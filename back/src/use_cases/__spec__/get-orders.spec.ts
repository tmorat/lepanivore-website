import { Order } from '../../domain/order/order';
import { OrderInterface } from '../../domain/order/order.interface';
import { OrderRepository } from '../../domain/order/order.repository';
import { GetOrders } from '../get-orders';

describe('use_cases/GetOrders', () => {
  let getOrders: GetOrders;
  let mockOrderRepository: OrderRepository;

  beforeEach(() => {
    mockOrderRepository = {} as OrderRepository;
    mockOrderRepository.findAll = jest.fn();

    getOrders = new GetOrders(mockOrderRepository);
  });

  describe('execute()', () => {
    it('should return found products', async () => {
      // given
      const orders: Order[] = [
        { id: 1, clientName: 'fake order 1' } as Order,
        {
          id: 2,
          clientName: 'fake order 2',
        } as Order,
      ];
      (mockOrderRepository.findAll as jest.Mock).mockReturnValue(Promise.resolve(orders));

      // when
      const result: OrderInterface[] = await getOrders.execute();

      // then
      expect(result).toStrictEqual(orders);
    });
  });
});
