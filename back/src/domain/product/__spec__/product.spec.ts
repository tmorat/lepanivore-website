import { NewProductCommand } from '../commands/new-product-command';
import { UpdateProductCommand } from '../commands/update-product-command';
import { InvalidProductError } from '../errors/invalid-product.error';
import { Product } from '../product';
import { ProductStatus } from '../product-status';
import { ProductInterface } from '../product.interface';

describe('domain/product/Product', () => {
  describe('factory', () => {
    describe('create()', () => {
      let newProductCommand: NewProductCommand;

      beforeEach(() => {
        newProductCommand = {
          name: 'product name',
          description: 'product description',
          price: 1.12,
        };
      });

      describe('id', () => {
        it('should initialize with no id', () => {
          // when
          const result: Product = Product.factory.create(newProductCommand);

          // then
          expect(result.id).toBeUndefined();
        });
      });

      describe('name', () => {
        it('should bind name from command', () => {
          // given
          newProductCommand.name = 'a super name';

          // when
          const result: Product = Product.factory.create(newProductCommand);

          // then
          expect(result.name).toBe('a super name');
        });

        it('should fail when name is empty', () => {
          // given
          newProductCommand.name = '';

          // when
          const result = () => Product.factory.create(newProductCommand);

          // then
          expect(result).toThrow(new InvalidProductError('name has to be defined'));
        });
      });

      describe('description', () => {
        it('should bind description from command', () => {
          // given
          newProductCommand.description = 'a super description';

          // when
          const result: Product = Product.factory.create(newProductCommand);

          // then
          expect(result.description).toBe('a super description');
        });

        it('should fail when description is empty', () => {
          // given
          newProductCommand.description = '';

          // when
          const result = () => Product.factory.create(newProductCommand);

          // then
          expect(result).toThrow(new InvalidProductError('description has to be defined'));
        });
      });

      describe('price', () => {
        it('should bind price from command', () => {
          // given
          newProductCommand.price = 42.13;

          // when
          const result: Product = Product.factory.create(newProductCommand);

          // then
          expect(result.price).toBe(42.13);
        });

        it('should fail when price is zero', () => {
          // given
          newProductCommand.price = 0;

          // when
          const result = () => Product.factory.create(newProductCommand);

          // then
          expect(result).toThrow(new InvalidProductError('price has to be a positive value'));
        });

        it('should fail when price is negative', () => {
          // given
          newProductCommand.price = -1;

          // when
          const result = () => Product.factory.create(newProductCommand);

          // then
          expect(result).toThrow(new InvalidProductError('price has to be a positive value'));
        });
      });

      describe('status', () => {
        it('should initialize with active status', () => {
          // when
          const result: Product = Product.factory.create(newProductCommand);

          // then
          expect(result.status).toBe(ProductStatus.ACTIVE);
        });
      });
    });

    describe('copy()', () => {
      it('should create a new instance as a copy of given product', () => {
        // given
        const productToCopy: ProductInterface = {
          id: 42,
          name: 'existing product name',
          description: 'existing product description',
          price: 1337.42,
          status: ProductStatus.ACTIVE,
        };

        // when
        const result: Product = Product.factory.copy(productToCopy);

        // then
        expect(result).toMatchObject(productToCopy);
        expect(result.archive).toBeDefined();
        expect(result.updateWith).toBeDefined();
      });
    });
  });

  describe('archive()', () => {
    it('should set status to archived', () => {
      // given
      const existingProduct: Product = Product.factory.copy({
        id: 42,
        name: 'product name',
        description: 'product description',
        price: 1337.42,
        status: ProductStatus.ACTIVE,
      });

      // when
      existingProduct.archive();

      // then
      expect(existingProduct.status).toBe(ProductStatus.ARCHIVED);
    });
  });

  describe('updateWith()', () => {
    let existingProduct: Product;
    let updateProductCommand: UpdateProductCommand;

    beforeEach(() => {
      existingProduct = Product.factory.copy({
        id: 42,
        name: 'product name',
        description: 'product description',
        price: 1337.42,
        status: ProductStatus.ACTIVE,
      });

      updateProductCommand = {
        productId: 42,
        description: 'new product description',
      };
    });

    describe('id', () => {
      it('should fail when existing order id does not match order id in command', () => {
        // given
        updateProductCommand.productId = 1337;

        // when
        const result = () => existingProduct.updateWith(updateProductCommand);

        // then
        expect(result).toThrow(new InvalidProductError('existing product id does not match product id in command'));
      });
    });

    describe('name', () => {
      it('should not change existing name value', () => {
        // when
        existingProduct.updateWith(updateProductCommand);

        // then
        expect(existingProduct.name).toBe('product name');
      });
    });

    describe('description', () => {
      it('should bind description from command', () => {
        // given
        updateProductCommand.description = 'a new super description';

        // when
        existingProduct.updateWith(updateProductCommand);

        // then
        expect(existingProduct.description).toBe('a new super description');
      });

      it('should fail when description is empty', () => {
        // given
        updateProductCommand.description = '';

        // when
        const result = () => existingProduct.updateWith(updateProductCommand);

        // then
        expect(result).toThrow(new InvalidProductError('description has to be defined'));
      });
    });

    describe('price', () => {
      it('should not change existing price value', () => {
        // when
        existingProduct.updateWith(updateProductCommand);

        // then
        expect(existingProduct.price).toBe(1337.42);
      });
    });

    describe('status', () => {
      it('should not change existing status value', () => {
        // when
        existingProduct.updateWith(updateProductCommand);

        // then
        expect(existingProduct.status).toBe(ProductStatus.ACTIVE);
      });
    });
  });
});
