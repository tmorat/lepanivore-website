import { ArgumentsHost } from '@nestjs/common';
import { InvalidClosingPeriodError } from '../../../../domain/invalid-closing-period.error';
import { InvalidClosingPeriodErrorFilter } from '../invalid-closing-period-error.filter';

describe('infrastructure/rest/filters/InvalidClosingPeriodErrorFilter', () => {
  let invalidClosingPeriodErrorFilter: InvalidClosingPeriodErrorFilter;
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

    invalidClosingPeriodErrorFilter = new InvalidClosingPeriodErrorFilter();
  });

  describe('catch()', () => {
    it('should call response status method with http bad request status code', () => {
      // given
      const invalidClosingPeriodError: InvalidClosingPeriodError = {} as InvalidClosingPeriodError;
      const expected: number = 400;

      // when
      invalidClosingPeriodErrorFilter.catch(invalidClosingPeriodError, mockArgumentsHost);

      // then
      expect(mockStatus).toHaveBeenCalledWith(expected);
    });

    it('should call response status json method with body from invalid closing period error', () => {
      // given
      const fixedDate: Date = new Date('2017-06-13T04:41:20');
      // @ts-ignore
      jest.spyOn(global, 'Date').mockImplementationOnce(() => fixedDate);

      const invalidClosingPeriodError: InvalidClosingPeriodError = {
        name: 'InvalidClosingPeriodError',
        message: 'A closing period validation error',
      } as InvalidClosingPeriodError;

      const expected: object = {
        statusCode: 400,
        timestamp: fixedDate.toISOString(),
        name: 'InvalidClosingPeriodError',
        message: 'A closing period validation error',
      };

      // when
      invalidClosingPeriodErrorFilter.catch(invalidClosingPeriodError, mockArgumentsHost);

      // then
      expect(mockJson).toHaveBeenCalledWith(expected);
    });
  });
});
