import { Injectable } from '@nestjs/common';
import { Product } from '../../domain/product';
import { ProductRepository } from '../../domain/product.repository';

@Injectable()
export class InMemoryProductRepository implements ProductRepository {
  async findAll(): Promise<Product[]> {
    return [
      { id: 1, name: "L'Enrobé Sésame", description: 'farine de blé tamisée, croûte de graines de sésame', price: 6.9 },
      { id: 2, name: 'La Miche Rustique, cuite sur pierre naturelle', description: 'farine de blé tamisée', price: 5.1 },
      { id: 3, name: 'Le Mariko', description: "farine de blé tamisée, écorces d'orange bio confites", price: 7.6 },
      { id: 4, name: 'Le Mariko Choco', description: "farine de blé tamisée, écorces d'orange bio confites et pépites de chocolat", price: 8.25 },
      { id: 5, name: 'Le Brasseur', description: 'farine de blé tamisée, orge malté qui a servi à brasser des bières', price: 6.7 },
      { id: 6, name: 'Le Canneberge', description: 'farine de blé tamisée, canneberges séchées', price: 6.6 },
      { id: 7, name: 'Le Raisin', description: 'farine de blé tamisée, raisins sultana', price: 6.6 },
      { id: 8, name: 'Le Datte', description: 'farine de blé tamisée, dattes séchées', price: 6.6 },
      { id: 9, name: 'Le Pois Chiche', description: 'farine de blé tamisée, farine de pois chiche)', price: 6.6 },
      { id: 10, name: 'Le Quinoa', description: 'farine de blé tamisée, farine de quinoa', price: 7 },
    ];
  }
}
