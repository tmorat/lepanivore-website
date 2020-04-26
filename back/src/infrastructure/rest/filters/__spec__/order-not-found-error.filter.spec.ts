import { ArgumentsHost } from '@nestjs/common';
import { OrderNotFoundError } from '../../../../domain/order-not-found.error';
import { OrderNotFoundErrorFilter } from '../order-not-found-error.filter';

describe('infrastructure/rest/filters/OrderNotFoundErrorFilter', () => {
  let orderNotFoundErrorFilter: OrderNotFoundErrorFilter;
  let mockArgumentsHost: ArgumentsHost;
  let mockStatus: jest.Mock;
  let mockJson: jest.Mock;

  beforeEach(() => {
    mockStatus = jest.fn();
    mockJson = jest.fn();

    mockStatus.mockImplementation(() => {
      return {
        json: mockJson,
      };
    });

    mockArgumentsHost = {
      switchToHttp: () => ({
        getResponse: () => ({
          status: mockStatus,
        }),
      }),
    } as ArgumentsHost;

    orderNotFoundErrorFilter = new OrderNotFoundErrorFilter();
  });

  describe('catch()', () => {
    it('should call response status method with http not found status code', () => {
      // given
      const orderNotFoundError: OrderNotFoundError = {} as OrderNotFoundError;
      const expected: number = 404;

      // when
      orderNotFoundErrorFilter.catch(orderNotFoundError, mockArgumentsHost);

      // then
      expect(mockStatus).toHaveBeenCalledWith(expected);
    });

    it('should call response status json method with body from order not found error', () => {
      // given
      const fixedDate: Date = new Date('2017-06-13T04:41:20');
      // @ts-ignore
      jest.spyOn(global, 'Date').mockImplementationOnce(() => fixedDate);

      const orderNotFoundError: OrderNotFoundError = {
        name: 'OrderNotFoundError',
        message: 'An order not found error',
      } as OrderNotFoundError;

      const expected: object = {
        statusCode: 404,
        timestamp: fixedDate.toISOString(),
        name: 'OrderNotFoundError',
        message: 'An order not found error',
      };

      // when
      orderNotFoundErrorFilter.catch(orderNotFoundError, mockArgumentsHost);

      // then
      expect(mockJson).toHaveBeenCalledWith(expected);
    });
  });
});
