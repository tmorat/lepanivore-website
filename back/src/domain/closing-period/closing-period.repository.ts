import { ClosingPeriodId } from '../type-aliases';
import { ClosingPeriodInterface } from './closing-period.interface';

export interface ClosingPeriodRepository {
  save(order: ClosingPeriodInterface): Promise<ClosingPeriodId>;
  delete(order: ClosingPeriodInterface): Promise<void>;
  findById(closingPeriodId: ClosingPeriodId): Promise<ClosingPeriodInterface>;
  findAll(): Promise<ClosingPeriodInterface[]>;
}
