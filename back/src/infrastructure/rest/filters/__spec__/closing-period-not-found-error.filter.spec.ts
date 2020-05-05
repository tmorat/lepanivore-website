import { ArgumentsHost } from '@nestjs/common';
import { ClosingPeriodNotFoundError } from '../../../../domain/closing-period-not-found.error';
import { ClosingPeriodNotFoundErrorFilter } from '../closing-period-not-found-error.filter';

describe('infrastructure/rest/filters/ClosingPeriodNotFoundErrorFilter', () => {
  let closingPeriodNotFoundErrorFilter: ClosingPeriodNotFoundErrorFilter;
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

    closingPeriodNotFoundErrorFilter = new ClosingPeriodNotFoundErrorFilter();
  });

  describe('catch()', () => {
    it('should call response status method with http not found status code', () => {
      // given
      const closingPeriodNotFoundError: ClosingPeriodNotFoundError = {} as ClosingPeriodNotFoundError;
      const expected: number = 404;

      // when
      closingPeriodNotFoundErrorFilter.catch(closingPeriodNotFoundError, mockArgumentsHost);

      // then
      expect(mockStatus).toHaveBeenCalledWith(expected);
    });

    it('should call response status json method with body from closing period not found error', () => {
      // given
      const fixedDate: Date = new Date('2017-06-13T04:41:20');
      // @ts-ignore
      jest.spyOn(global, 'Date').mockImplementationOnce(() => fixedDate);

      const closingPeriodNotFoundError: ClosingPeriodNotFoundError = {
        name: 'ClosingPeriodNotFoundError',
        message: 'A closing period not found error',
      } as ClosingPeriodNotFoundError;

      const expected: object = {
        statusCode: 404,
        timestamp: fixedDate.toISOString(),
        name: 'ClosingPeriodNotFoundError',
        message: 'A closing period not found error',
      };

      // when
      closingPeriodNotFoundErrorFilter.catch(closingPeriodNotFoundError, mockArgumentsHost);

      // then
      expect(mockJson).toHaveBeenCalledWith(expected);
    });
  });
});
