import { ClosingPeriod } from '../domain/closing-period';
import { ClosingPeriodRepository } from '../domain/closing-period.repository';
import { NewClosingPeriodCommand } from '../domain/commands/new-closing-period-command';
import { ClosingPeriodId } from '../domain/type-aliases';

export class AddNewClosingPeriod {
  constructor(private readonly closingPeriodRepository: ClosingPeriodRepository) {}

  async execute(newClosingPeriodCommand: NewClosingPeriodCommand): Promise<ClosingPeriodId> {
    const closingPeriod: ClosingPeriod = ClosingPeriod.factory.create(newClosingPeriodCommand);

    return this.closingPeriodRepository.save(closingPeriod);
  }
}
