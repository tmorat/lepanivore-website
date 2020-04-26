import { ClosingPeriodInterface } from './closing-period.interface';

export interface ClosingPeriodRepository {
  findAll(): Promise<ClosingPeriodInterface[]>;
}
