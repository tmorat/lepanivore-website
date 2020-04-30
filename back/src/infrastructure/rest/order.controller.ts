import { Body, Controller, Delete, Get, HttpCode, Inject, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { DeleteOrderCommand } from '../../domain/commands/delete-order-command';
import { NewOrderCommand } from '../../domain/commands/new-order-command';
import { UpdateOrderCommand } from '../../domain/commands/update-order-command';
import { OrderType } from '../../domain/order-type';
import { OrderInterface } from '../../domain/order.interface';
import { OrderId } from '../../domain/type-aliases';
import { DeleteOrder } from '../../use_cases/delete-order';
import { GetOrders } from '../../use_cases/get-orders';
import { OrderProducts } from '../../use_cases/order-products';
import { UpdateExistingOrder } from '../../use_cases/update-existing-order';
import { ProxyServicesDynamicModule } from '../use_cases_proxy/proxy-services-dynamic.module';
import { UseCaseProxy } from '../use_cases_proxy/use-case-proxy';
import { GetOrderResponse } from './models/get-order-response';
import { PostOrderRequest } from './models/post-order-request';
import { PostOrderResponse } from './models/post-order-response';
import { PutOrderRequest } from './models/put-order-request';

@Controller('/api/orders')
export class OrderController {
  constructor(
    @Inject(ProxyServicesDynamicModule.GET_ORDERS_PROXY_SERVICE) private readonly getOrdersProxyService: UseCaseProxy<GetOrders>,
    @Inject(ProxyServicesDynamicModule.ORDER_PRODUCTS_PROXY_SERVICE) private readonly orderProductsProxyService: UseCaseProxy<OrderProducts>,
    @Inject(ProxyServicesDynamicModule.UPDATE_EXISTING_ORDER_PROXY_SERVICE)
    private readonly updateExistingOrderProxyService: UseCaseProxy<UpdateExistingOrder>,
    @Inject(ProxyServicesDynamicModule.DELETE_ORDER_PROXY_SERVICE) private readonly deleteOrderProxyService: UseCaseProxy<DeleteOrder>
  ) {}

  @Get('/')
  @UseGuards(AuthGuard('jwt'))
  async getOrders(): Promise<GetOrderResponse[]> {
    const orders: OrderInterface[] = await this.getOrdersProxyService.getInstance().execute();

    return orders.map(
      (order: OrderInterface): GetOrderResponse => ({
        ...order,
        pickUpDate: order.pickUpDate ? order.pickUpDate.toISOString().split('T')[0] : undefined,
        deliveryDate: order.deliveryDate ? order.deliveryDate.toISOString().split('T')[0] : undefined,
      })
    );
  }

  @Post('/')
  async postOrder(@Body() postOrderRequest: PostOrderRequest, @Req() request: Request): Promise<PostOrderResponse> {
    const orderId: OrderId = await this.orderProductsProxyService.getInstance().execute(this.toNewOrderCommand(postOrderRequest));

    request.res.location(`${request.route.path}/${orderId}`);

    return { id: orderId };
  }

  @Put('/:id')
  @UseGuards(AuthGuard('jwt'))
  async putOrder(@Param('id') id: string, @Body() putOrderRequest: PutOrderRequest): Promise<void> {
    await this.updateExistingOrderProxyService.getInstance().execute(this.toUpdateOrderCommand(id, putOrderRequest));
  }

  @Delete('/:id')
  @HttpCode(204)
  @UseGuards(AuthGuard('jwt'))
  async deleteOrder(@Param('id') id: string): Promise<void> {
    await this.deleteOrderProxyService.getInstance().execute(this.toDeleteCommand(id));
  }

  private toNewOrderCommand(postOrderRequest: PostOrderRequest): NewOrderCommand {
    return {
      clientName: postOrderRequest.clientName,
      clientPhoneNumber: postOrderRequest.clientPhoneNumber,
      clientEmailAddress: postOrderRequest.clientEmailAddress,
      products: postOrderRequest.products,
      type: postOrderRequest.type as OrderType,
      pickUpDate: this.toDate(postOrderRequest.pickUpDate),
      deliveryDate: this.toDate(postOrderRequest.deliveryDate),
      deliveryAddress: postOrderRequest.deliveryAddress,
      note: postOrderRequest.note,
    };
  }

  private toUpdateOrderCommand(id: string, putOrderRequest: PutOrderRequest): UpdateOrderCommand {
    return {
      orderId: parseInt(id, 10),
      products: putOrderRequest.products,
      type: putOrderRequest.type as OrderType,
      pickUpDate: this.toDate(putOrderRequest.pickUpDate),
      deliveryDate: this.toDate(putOrderRequest.deliveryDate),
      deliveryAddress: putOrderRequest.deliveryAddress,
      note: putOrderRequest.note,
    };
  }

  private toDeleteCommand(id: string): DeleteOrderCommand {
    return { orderId: parseInt(id, 10) };
  }

  private toDate(dateAsString: string): Date {
    if (!dateAsString) {
      return undefined;
    }
    if (dateAsString.length > 10) {
      return new Date(dateAsString);
    } else {
      return new Date(`${dateAsString}T12:00:00Z`);
    }
  }
}
