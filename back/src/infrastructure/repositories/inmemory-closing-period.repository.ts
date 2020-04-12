import { Injectable } from '@nestjs/common';
import { ClosingPeriod } from '../../domain/closing-period';
import { ClosingPeriodRepository } from '../../domain/closing-period.repository';
import { Product } from '../../domain/product';
import { ProductRepository } from '../../domain/product.repository';

@Injectable()
export class InMemoryClosingPeriodRepository implements ClosingPeriodRepository {
  async findAll(): Promise<ClosingPeriod[]> {
    return [
      { start: new Date('2020-07-01T12:00:00Z'), end: new Date('2020-08-15T12:00:00Z') },
      { start: new Date('2020-12-15T12:00:00Z'), end: new Date('2021-01-02T12:00:00Z') },
    ];
  }
}
