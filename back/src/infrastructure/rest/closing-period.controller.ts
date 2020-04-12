import { Controller, Get, Inject } from '@nestjs/common';
import { ClosingPeriod } from '../../domain/closing-period';
import { GetClosingPeriods } from '../../use_cases/get-closing-periods';
import { ProxyServicesDynamicModule } from '../use_cases_proxy/proxy-services-dynamic.module';
import { UseCaseProxy } from '../use_cases_proxy/use-case-proxy';
import { GetClosingPeriodResponse } from './models/get-closing-period-response';

@Controller('/api/closing-periods')
export class ClosingPeriodController {
  constructor(
    @Inject(ProxyServicesDynamicModule.GET_CLOSING_PERIODS_PROXY_SERVICE)
    private readonly getClosingPeriodsProxyService: UseCaseProxy<GetClosingPeriods>
  ) {}

  @Get('/')
  async getClosingPeriods(): Promise<GetClosingPeriodResponse[]> {
    const closingPeriods: ClosingPeriod[] = await this.getClosingPeriodsProxyService.getInstance().execute();

    return closingPeriods.map(
      (closingPeriod: ClosingPeriod) =>
        ({ start: closingPeriod.start.toISOString(), end: closingPeriod.end.toISOString() } as GetClosingPeriodResponse)
    );
  }
}
