import { Controller, Get, Inject, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { DisableProductOrdering } from '../../use_cases/disable-product-ordering';
import { EnableProductOrdering } from '../../use_cases/enable-product-ordering';
import { GetProductOrderingStatus } from '../../use_cases/get-product-ordering-status';
import { ProxyServicesDynamicModule } from '../use_cases_proxy/proxy-services-dynamic.module';
import { UseCaseProxy } from '../use_cases_proxy/use-case-proxy';
import { GetProductOrderingResponse } from './models/get-product-ordering-response';

@Controller('/api/product-ordering')
export class ProductOrderingController {
  constructor(
    @Inject(ProxyServicesDynamicModule.GET_PRODUCT_ORDERING_STATUS_PROXY_SERVICE)
    private readonly getProductOrderingStatusProxyService: UseCaseProxy<GetProductOrderingStatus>,
    @Inject(ProxyServicesDynamicModule.ENABLE_PRODUCT_ORDERING_PROXY_SERVICE)
    private readonly enableProductOrderingProxyService: UseCaseProxy<EnableProductOrdering>,
    @Inject(ProxyServicesDynamicModule.DISABLE_PRODUCT_ORDERING_PROXY_SERVICE)
    private readonly disableProductOrderingProxyService: UseCaseProxy<DisableProductOrdering>
  ) {}

  @Get('/status')
  async getProductOrderingStatus(): Promise<GetProductOrderingResponse> {
    return this.getProductOrderingStatusProxyService.getInstance().execute();
  }

  @Put('/enable')
  @UseGuards(AuthGuard('jwt'))
  async putEnableProductOrdering(): Promise<void> {
    return this.enableProductOrderingProxyService.getInstance().execute();
  }

  @Put('/disable')
  @UseGuards(AuthGuard('jwt'))
  async putDisableProductOrdering(): Promise<void> {
    return this.disableProductOrderingProxyService.getInstance().execute();
  }
}
