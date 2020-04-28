import { ArgumentsHost } from '@nestjs/common';
import { ProductNotFoundError } from '../../../../domain/product-not-found.error';
import { ProductNotFoundErrorFilter } from '../product-not-found-error.filter';

describe('infrastructure/rest/filters/ProductNotFoundErrorFilter', () => {
  let productNotFoundErrorFilter: ProductNotFoundErrorFilter;
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

    productNotFoundErrorFilter = new ProductNotFoundErrorFilter();
  });

  describe('catch()', () => {
    it('should call response status method with http not found status code', () => {
      // given
      const productNotFoundError: ProductNotFoundError = {} as ProductNotFoundError;
      const expected: number = 404;

      // when
      productNotFoundErrorFilter.catch(productNotFoundError, mockArgumentsHost);

      // then
      expect(mockStatus).toHaveBeenCalledWith(expected);
    });

    it('should call response status json method with body from product not found error', () => {
      // given
      const fixedDate: Date = new Date('2017-06-13T04:41:20');
      // @ts-ignore
      jest.spyOn(global, 'Date').mockImplementationOnce(() => fixedDate);

      const productNotFoundError: ProductNotFoundError = {
        name: 'ProductNotFoundError',
        message: 'An product not found error',
      } as ProductNotFoundError;

      const expected: object = {
        statusCode: 404,
        timestamp: fixedDate.toISOString(),
        name: 'ProductNotFoundError',
        message: 'An product not found error',
      };

      // when
      productNotFoundErrorFilter.catch(productNotFoundError, mockArgumentsHost);

      // then
      expect(mockJson).toHaveBeenCalledWith(expected);
    });
  });
});
