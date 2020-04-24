import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request, { Response } from 'supertest';
import { ClosingPeriodInterface } from '../../src/domain/closing-period.interface';
import { EnvironmentConfigService } from '../../src/infrastructure/config/environment-config/environment-config.service';
import { GetClosingPeriodResponse } from '../../src/infrastructure/rest/models/get-closing-period-response';
import { RestModule } from '../../src/infrastructure/rest/rest.module';
import { ProxyServicesDynamicModule } from '../../src/infrastructure/use_cases_proxy/proxy-services-dynamic.module';
import { UseCaseProxy } from '../../src/infrastructure/use_cases_proxy/use-case-proxy';
import { GetClosingPeriods } from '../../src/use_cases/get-closing-periods';
import { e2eEnvironmentConfigService } from '../e2e-config';

describe('infrastructure/rest/ClosingPeriodController (e2e)', () => {
  let app: INestApplication;
  let mockGetClosingPeriods: GetClosingPeriods;

  beforeAll(async () => {
    mockGetClosingPeriods = {} as GetClosingPeriods;
    mockGetClosingPeriods.execute = jest.fn();
    const mockGetClosingPeriodsProxyService: UseCaseProxy<GetClosingPeriods> = {
      getInstance: () => mockGetClosingPeriods,
    } as UseCaseProxy<GetClosingPeriods>;

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [RestModule],
    })
      .overrideProvider(ProxyServicesDynamicModule.GET_CLOSING_PERIODS_PROXY_SERVICE)
      .useValue(mockGetClosingPeriodsProxyService)
      .overrideProvider(EnvironmentConfigService)
      .useValue(e2eEnvironmentConfigService)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('GET /api/closing-periods', () => {
    it('should return http status code OK with found closing periods', () => {
      // given
      const closingPeriods: ClosingPeriodInterface[] = [
        { start: new Date('2020-07-01T12:00:00Z'), end: new Date('2020-08-15T12:00:00Z') },
        { start: new Date('2020-12-15T12:00:00Z'), end: new Date('2021-01-02T12:00:00Z') },
      ];
      (mockGetClosingPeriods.execute as jest.Mock).mockReturnValue(Promise.resolve(closingPeriods));

      // when
      const testRequest: request.Test = request(app.getHttpServer()).get('/api/closing-periods');

      // then
      return testRequest.expect(200).expect((response: Response) => {
        expect(response.body).toStrictEqual([
          { start: '2020-07-01T12:00:00.000Z', end: '2020-08-15T12:00:00.000Z' },
          { start: '2020-12-15T12:00:00.000Z', end: '2021-01-02T12:00:00.000Z' },
        ] as GetClosingPeriodResponse[]);
      });
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
