import { ClosingPeriod } from '../domain/closing-period';
import { ClosingPeriodRepository } from '../domain/closing-period.repository';

export class GetClosingPeriods {
  constructor(private readonly closingPeriodRepository: ClosingPeriodRepository) {}

  async execute(): Promise<ClosingPeriod[]> {
    return this.closingPeriodRepository.findAll();
  }
}
