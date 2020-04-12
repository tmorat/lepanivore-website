import { ProductId } from './type-aliases';

export class Product {
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
