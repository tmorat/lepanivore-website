import { ProductInterface } from './product.interface';
import { ProductId } from './type-aliases';

export class Product implements ProductInterface {
  id: ProductId;
  name: string;
  description: string;
  price: number;

  constructor() {
    this.id = 0;
    this.name = '';
    this.description = '';
    this.price = 0;
  }
}
