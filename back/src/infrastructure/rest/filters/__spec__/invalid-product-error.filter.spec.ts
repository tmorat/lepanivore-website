import { ArgumentsHost } from '@nestjs/common';
import { InvalidProductError } from '../../../../domain/invalid-product.error';
import { InvalidProductErrorFilter } from '../invalid-product-error.filter';

describe('infrastructure/rest/filters/InvalidProductErrorFilter', () => {
  let invalidProductErrorFilter: InvalidProductErrorFilter;
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

    invalidProductErrorFilter = new InvalidProductErrorFilter();
  });

  describe('catch()', () => {
    it('should call response status method with http bad request status code', () => {
      // given
      const invalidProductError: InvalidProductError = {} as InvalidProductError;
      const expected: number = 400;

      // when
      invalidProductErrorFilter.catch(invalidProductError, mockArgumentsHost);

      // then
      expect(mockStatus).toHaveBeenCalledWith(expected);
    });

    it('should call response status json method with body from invalid product error', () => {
      // given
      const fixedDate: Date = new Date('2017-06-13T04:41:20');
      // @ts-ignore
      jest.spyOn(global, 'Date').mockImplementationOnce(() => fixedDate);

      const invalidProductError: InvalidProductError = {
        name: 'InvalidProductError',
        message: 'A product validation error',
      } as InvalidProductError;

      const expected: object = {
        statusCode: 400,
        timestamp: fixedDate.toISOString(),
        name: 'InvalidProductError',
        message: 'A product validation error',
      };

      // when
      invalidProductErrorFilter.catch(invalidProductError, mockArgumentsHost);

      // then
      expect(mockJson).toHaveBeenCalledWith(expected);
    });
  });
});
