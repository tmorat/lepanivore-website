import { ArgumentsHost } from '@nestjs/common';
import { InvalidOrderError } from '../../../../domain/invalid-order.error';
import { InvalidOrderErrorFilter } from '../invalid-order-error.filter';

describe('infrastructure/rest/filters/InvalidOrderErrorFilter', () => {
  let invalidOrderErrorFilter: InvalidOrderErrorFilter;
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

    invalidOrderErrorFilter = new InvalidOrderErrorFilter();
  });

  describe('catch()', () => {
    it('should call response status method with http bad request status code', () => {
      // given
      const invalidOrderError: InvalidOrderError = {} as InvalidOrderError;
      const expected: number = 400;

      // when
      invalidOrderErrorFilter.catch(invalidOrderError, mockArgumentsHost);

      // then
      expect(mockStatus).toHaveBeenCalledWith(expected);
    });

    it('should call response status json method with body from invalid order error', () => {
      // given
      const fixedDate: Date = new Date('2017-06-13T04:41:20');
      // @ts-ignore
      jest.spyOn(global, 'Date').mockImplementationOnce(() => fixedDate);

      const invalidOrderError: InvalidOrderError = {
        name: 'InvalidOrderError',
        message: 'An order validation error',
      } as InvalidOrderError;

      const expected: object = {
        statusCode: 400,
        timestamp: fixedDate.toISOString(),
        name: 'InvalidOrderError',
        message: 'An order validation error',
      };

      // when
      invalidOrderErrorFilter.catch(invalidOrderError, mockArgumentsHost);

      // then
      expect(mockJson).toHaveBeenCalledWith(expected);
    });
  });
});
