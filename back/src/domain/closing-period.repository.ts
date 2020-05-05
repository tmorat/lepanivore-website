import { ClosingPeriodInterface } from './closing-period.interface';
import { ClosingPeriodId } from './type-aliases';

export interface ClosingPeriodRepository {
  save(order: ClosingPeriodInterface): Promise<ClosingPeriodId>;
  delete(order: ClosingPeriodInterface): Promise<void>;
  findById(closingPeriodId: ClosingPeriodId): Promise<ClosingPeriodInterface>;
  findAll(): Promise<ClosingPeriodInterface[]>;
}
