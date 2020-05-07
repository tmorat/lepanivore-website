import { NewProductCommand } from '../../domain/product/commands/new-product-command';
import { Product, ProductFactoryInterface } from '../../domain/product/product';
import { ProductRepository } from '../../domain/product/product.repository';
import { AddNewProduct } from '../add-new-product';

describe('uses_cases/AddNewProduct', () => {
  let addNewProduct: AddNewProduct;
  let mockProductRepository: ProductRepository;

  beforeEach(() => {
    Product.factory = {} as ProductFactoryInterface;
    Product.factory.create = jest.fn();

    mockProductRepository = {} as ProductRepository;
    mockProductRepository.save = jest.fn();

    addNewProduct = new AddNewProduct(mockProductRepository);
  });

  describe('execute()', () => {
    it('should create new product using command', async () => {
      // given
      const newProductCommand: NewProductCommand = {
        name: 'new product name',
        description: 'new product description',
        price: 19.88,
      };

      // when
      await addNewProduct.execute(newProductCommand);

      // then
      expect(Product.factory.create).toHaveBeenCalledWith(newProductCommand);
    });

    it('should save created product', async () => {
      // given
      const createdProduct: Product = { name: 'new product name' } as Product;
      (Product.factory.create as jest.Mock).mockReturnValue(createdProduct);

      // when
      await addNewProduct.execute({} as NewProductCommand);

      // then
      expect(mockProductRepository.save).toHaveBeenCalledWith(createdProduct);
    });
  });
});
