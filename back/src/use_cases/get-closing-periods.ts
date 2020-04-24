import { ClosingPeriodInterface } from '../domain/closing-period.interface';
import { ClosingPeriodRepository } from '../domain/closing-period.repository';

export class GetClosingPeriods {
  constructor(private readonly closingPeriodRepository: ClosingPeriodRepository) {}

  async execute(): Promise<ClosingPeriodInterface[]> {
    return this.closingPeriodRepository.findAll();
  }
}
