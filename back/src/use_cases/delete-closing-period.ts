import { ClosingPeriodInterface } from '../domain/closing-period/closing-period.interface';
import { ClosingPeriodRepository } from '../domain/closing-period/closing-period.repository';
import { DeleteClosingPeriodCommand } from '../domain/closing-period/commands/delete-closing-period-command';

export class DeleteClosingPeriod {
  constructor(private readonly closingPeriodRepository: ClosingPeriodRepository) {}

  async execute(deleteClosingPeriodCommand: DeleteClosingPeriodCommand): Promise<void> {
    const closingPeriodToDelete: ClosingPeriodInterface = await this.closingPeriodRepository.findById(deleteClosingPeriodCommand.closingPeriodId);
    await this.closingPeriodRepository.delete(closingPeriodToDelete);
  }
}
