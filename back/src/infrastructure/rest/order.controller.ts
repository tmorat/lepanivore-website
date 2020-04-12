import { Body, Controller, Get, Inject, Post, Query, Req } from '@nestjs/common';
import { Request } from 'express';
import { NewOrderCommand } from '../../domain/commands/new-order-command';
import { Order } from '../../domain/order';
import { OrderType } from '../../domain/order-type';
import { OrderId } from '../../domain/type-aliases';
import { GetOrders } from '../../use_cases/get-orders';
import { OrderProducts } from '../../use_cases/order-products';
import { ProxyServicesDynamicModule } from '../use_cases_proxy/proxy-services-dynamic.module';
import { UseCaseProxy } from '../use_cases_proxy/use-case-proxy';
import { GetOrderResponse } from './models/get-order-response';
import { PostOrderRequest } from './models/post-order-request';
import { PostOrderResponse } from './models/post-order-response';

@Controller('/api/orders')
export class OrderController {
  constructor(
    @Inject(ProxyServicesDynamicModule.GET_ORDERS_PROXY_SERVICE) private readonly getOrdersProxyService: UseCaseProxy<GetOrders>,
    @Inject(ProxyServicesDynamicModule.ORDER_PRODUCTS_PROXY_SERVICE) private readonly orderProductsProxyService: UseCaseProxy<OrderProducts>
  ) {}

  @Get('/')
  // TODO admin guard
  async getOrders(): Promise<GetOrderResponse[]> {
    return this.getOrdersProxyService.getInstance().execute();
  }

  @Post('/')
  async postOrder(@Body() postOrderRequest: PostOrderRequest, @Req() request: Request): Promise<PostOrderResponse> {
    const orderId: OrderId = await this.orderProductsProxyService.getInstance().execute(this.toNewOrderCommand(postOrderRequest));

    request.res.location(`${request.route.path}/${orderId}`);

    return { id: orderId };
  }

  private toNewOrderCommand(postOrderRequest: PostOrderRequest): NewOrderCommand {
    return {
      clientName: postOrderRequest.clientName,
      clientPhoneNumber: postOrderRequest.clientPhoneNumber,
      clientEmailAddress: postOrderRequest.clientEmailAddress,
      products: postOrderRequest.products,
      type: postOrderRequest.type as OrderType,
      pickUpDate: postOrderRequest.pickUpDate ? new Date(postOrderRequest.pickUpDate) : undefined,
      deliveryAddress: postOrderRequest.deliveryAddress,
    };
  }
}
