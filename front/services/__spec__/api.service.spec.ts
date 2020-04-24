import { NuxtAxiosInstance } from '@nuxtjs/axios';
import { AxiosError, AxiosResponse } from 'axios';
import ApiService from '~/services/api.service';
import { OrderId } from '../../../back/src/domain/type-aliases';
import { GetClosingPeriodResponse } from '../../../back/src/infrastructure/rest/models/get-closing-period-response';
import { GetOrderResponse } from '../../../back/src/infrastructure/rest/models/get-order-response';
import { GetProductResponse } from '../../../back/src/infrastructure/rest/models/get-product-response';
import { PostOrderRequest } from '../../../back/src/infrastructure/rest/models/post-order-request';
import { PostOrderResponse } from '../../../back/src/infrastructure/rest/models/post-order-response';
import { PutOrderRequest } from '../../../back/src/infrastructure/rest/models/put-order-request';

describe('services/ApiService', () => {
  let apiService: ApiService;
  let $get: jest.Mock;
  let $post: jest.Mock;
  let $put: jest.Mock;
  let $delete: jest.Mock;
  let useMock: jest.Mock;

  beforeEach(() => {
    $get = jest.fn();
    $post = jest.fn();
    $put = jest.fn();
    $delete = jest.fn();
    useMock = jest.fn();
    const $axios: object = { $get, $post, $put, $delete, interceptors: { response: { use: useMock } } };
    const mockAxios: NuxtAxiosInstance = $axios as NuxtAxiosInstance;
    apiService = new ApiService(mockAxios);
  });

  describe('constructor()', () => {
    it('should call use methods of response interceptor with undefined onFulfilled callback', () => {
      // then
      expect(useMock).toHaveBeenCalled();
      expect(useMock.mock.calls[0][0]).toBeUndefined();
    });
    it('should call use methods of response interceptor with defined onRejected callback that return data from error', () => {
      // given
      const rejectCallback: (error: AxiosError) => Promise<unknown> = useMock.mock.calls[0][1];
      const error: AxiosError = {} as AxiosError;
      error.response = { data: 'An error data' } as AxiosResponse;

      // when
      const result: Promise<unknown> = rejectCallback(error);

      // then
      expect(result).rejects.toBe('An error data');
    });
  });

  describe('getOrders()', () => {
    it('should get orders from api', async () => {
      // when
      await apiService.getOrders();

      // then
      expect($get).toHaveBeenCalledWith('/api/orders');
    });
    it('should return orders', async () => {
      // given
      const response: GetOrderResponse[] = [{ id: 1, clientName: 'fake order 1' } as GetOrderResponse];
      $get.mockReturnValue(Promise.resolve(response));

      // when
      const result: GetOrderResponse[] = await apiService.getOrders();

      // then
      expect(result).toStrictEqual(response);
    });
  });

  describe('postOrder()', () => {
    it('should post order to api', async () => {
      // given
      const request: PostOrderRequest = { clientName: 'fake client' } as PostOrderRequest;

      // when
      await apiService.postOrder(request);

      // then
      expect($post).toHaveBeenCalledWith('/api/orders', request);
    });
    it('should return order id', async () => {
      // given
      const request: PostOrderRequest = { clientName: 'fake client' } as PostOrderRequest;
      const response: PostOrderResponse = { id: 1337 };
      $post.mockReturnValue(Promise.resolve(response));

      // when
      const result: PostOrderResponse = await apiService.postOrder(request);

      // then
      expect(result).toStrictEqual(response);
    });
  });

  describe('putOrder()', () => {
    it('should put order to api', async () => {
      // given
      const orderId: OrderId = 42;
      const request: PutOrderRequest = { deliveryAddress: 'another delivery address' } as PutOrderRequest;

      // when
      await apiService.putOrder(orderId, request);

      // then
      expect($put).toHaveBeenCalledWith('/api/orders/42', request);
    });
  });
  describe('deleteOrder()', () => {
    it('should delete order to api', async () => {
      // given
      const orderId: OrderId = 42;

      // when
      await apiService.deleteOrder(orderId);

      // then
      expect($delete).toHaveBeenCalledWith('/api/orders/42');
    });
  });

  describe('getClosingPeriods()', () => {
    it('should get closing periods from api', async () => {
      // when
      await apiService.getClosingPeriods();

      // then
      expect($get).toHaveBeenCalledWith('/api/closing-periods');
    });
    it('should return closing periods', async () => {
      // given
      const response: GetClosingPeriodResponse[] = [{ start: '2020-04-09T00:00:00Z', end: '2020-04-20T00:00:00Z' }];
      $get.mockReturnValue(Promise.resolve(response));

      // when
      const result: GetClosingPeriodResponse[] = await apiService.getClosingPeriods();

      // then
      expect(result).toStrictEqual(response);
    });
  });

  describe('getProducts()', () => {
    it('should get products from api', async () => {
      // when
      await apiService.getProducts();

      // then
      expect($get).toHaveBeenCalledWith('/api/products');
    });
    it('should return products', async () => {
      // given
      const response: GetProductResponse[] = [{ id: 1, name: 'fake product 1' } as GetProductResponse];
      $get.mockReturnValue(Promise.resolve(response));

      // when
      const result: GetProductResponse[] = await apiService.getProducts();

      // then
      expect(result).toStrictEqual(response);
    });
  });
});
