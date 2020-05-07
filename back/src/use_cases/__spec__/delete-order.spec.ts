import { DeleteOrderCommand } from '../../domain/order/commands/delete-order-command';
import { OrderInterface } from '../../domain/order/order.interface';
import { OrderRepository } from '../../domain/order/order.repository';
import { DeleteOrder } from '../delete-order';

describe('uses_cases/DeleteOrder', () => {
  let deleteOrder: DeleteOrder;
  let mockOrderRepository: OrderRepository;
  let deleteOrderCommand: DeleteOrderCommand;

  beforeEach(() => {
    mockOrderRepository = {} as OrderRepository;
    mockOrderRepository.delete = jest.fn();
    mockOrderRepository.findById = jest.fn();

    deleteOrder = new DeleteOrder(mockOrderRepository);

    deleteOrderCommand = {
      orderId: 42,
    };
  });

  describe('execute()', () => {
    it('should search for existing order', async () => {
      // given
      deleteOrderCommand.orderId = 1337;

      // when
      await deleteOrder.execute(deleteOrderCommand);

      // then
      expect(mockOrderRepository.findById).toHaveBeenCalledWith(1337);
    });

    it('should delete found order', async () => {
      // given
      const existingOrder: OrderInterface = { clientName: 'fake order' } as OrderInterface;
      (mockOrderRepository.findById as jest.Mock).mockReturnValue(Promise.resolve(existingOrder));

      // when
      await deleteOrder.execute(deleteOrderCommand);

      // then
      expect(mockOrderRepository.delete).toHaveBeenCalledWith(existingOrder);
    });
  });
});
