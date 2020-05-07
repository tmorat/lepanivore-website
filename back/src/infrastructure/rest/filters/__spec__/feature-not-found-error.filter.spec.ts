import { ArgumentsHost } from '@nestjs/common';
import { FeatureNotFoundError } from '../../../../domain/feature-not-found.error';
import { FeatureNotFoundErrorFilter } from '../feature-not-found-error.filter';

describe('infrastructure/rest/filters/FeatureNotFoundErrorFilter', () => {
  let featureNotFoundErrorFilter: FeatureNotFoundErrorFilter;
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

    featureNotFoundErrorFilter = new FeatureNotFoundErrorFilter();
  });

  describe('catch()', () => {
    it('should call response status method with http not found status code', () => {
      // given
      const featureNotFoundError: FeatureNotFoundError = {} as FeatureNotFoundError;
      const expected: number = 404;

      // when
      featureNotFoundErrorFilter.catch(featureNotFoundError, mockArgumentsHost);

      // then
      expect(mockStatus).toHaveBeenCalledWith(expected);
    });

    it('should call response status json method with body from feature not found error', () => {
      // given
      const fixedDate: Date = new Date('2017-06-13T04:41:20');
      // @ts-ignore
      jest.spyOn(global, 'Date').mockImplementationOnce(() => fixedDate);

      const featureNotFoundError: FeatureNotFoundError = {
        name: 'FeatureNotFoundError',
        message: 'A feature not found error',
      } as FeatureNotFoundError;

      const expected: object = {
        statusCode: 404,
        timestamp: fixedDate.toISOString(),
        name: 'FeatureNotFoundError',
        message: 'A feature not found error',
      };

      // when
      featureNotFoundErrorFilter.catch(featureNotFoundError, mockArgumentsHost);

      // then
      expect(mockJson).toHaveBeenCalledWith(expected);
    });
  });
});
