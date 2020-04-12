import { ClosingPeriod } from './closing-period';

export interface ClosingPeriodRepository {
  findAll(): Promise<ClosingPeriod[]>;
}
