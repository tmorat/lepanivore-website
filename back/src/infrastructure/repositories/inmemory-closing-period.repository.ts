import { Injectable } from '@nestjs/common';
import { ClosingPeriodInterface } from '../../domain/closing-period.interface';
import { ClosingPeriodRepository } from '../../domain/closing-period.repository';

@Injectable()
export class InMemoryClosingPeriodRepository implements ClosingPeriodRepository {
  async findAll(): Promise<ClosingPeriodInterface[]> {
    return [
      { start: new Date('2020-07-01T12:00:00Z'), end: new Date('2020-08-15T12:00:00Z') },
      { start: new Date('2020-12-15T12:00:00Z'), end: new Date('2021-01-02T12:00:00Z') },
    ];
  }
}
