import { Controller, Get, Inject } from '@nestjs/common';
import { GetProducts } from '../../use_cases/get-products';
import { ProxyServicesDynamicModule } from '../use_cases_proxy/proxy-services-dynamic.module';
import { UseCaseProxy } from '../use_cases_proxy/use-case-proxy';
import { GetProductResponse } from './models/get-product-response';

@Controller('/api/products')
export class ProductController {
  constructor(
    @Inject(ProxyServicesDynamicModule.GET_PRODUCTS_PROXY_SERVICE)
    private readonly getProductsProxyService: UseCaseProxy<GetProducts>
  ) {}

  @Get('/')
  async getProducts(): Promise<GetProductResponse[]> {
    return this.getProductsProxyService.getInstance().execute();
  }
}
