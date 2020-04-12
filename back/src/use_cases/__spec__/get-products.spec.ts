import { Product } from '../../domain/product';
import { ProductRepository } from '../../domain/product.repository';
import { GetProducts } from '../get-products';

describe('use_cases/GetProducts', () => {
  let getProducts: GetProducts;
  let mockProductRepository: ProductRepository;

  beforeEach(() => {
    mockProductRepository = {} as ProductRepository;
    mockProductRepository.findAll = jest.fn();

    getProducts = new GetProducts(mockProductRepository);
  });

  describe('execute()', () => {
    it('should return found products', async () => {
      // given
      const products: Product[] = [
        { id: 1, name: 'fake product 1' } as Product,
        {
          id: 2,
          name: 'fake product 2',
        } as Product,
      ];
      (mockProductRepository.findAll as jest.Mock).mockReturnValue(Promise.resolve(products));

      // when
      const result: Product[] = await getProducts.execute();

      // then
      expect(result).toStrictEqual(products);
    });
  });
});
