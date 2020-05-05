import { ClosingPeriod, ClosingPeriodFactoryInterface } from '../../domain/closing-period';
import { ClosingPeriodRepository } from '../../domain/closing-period.repository';
import { NewClosingPeriodCommand } from '../../domain/commands/new-closing-period-command';
import { AddNewClosingPeriod } from '../add-new-closing-period';

describe('uses_cases/AddNewClosingPeriod', () => {
  let addNewClosingPeriod: AddNewClosingPeriod;
  let mockClosingPeriodRepository: ClosingPeriodRepository;

  beforeEach(() => {
    ClosingPeriod.factory = {} as ClosingPeriodFactoryInterface;
    ClosingPeriod.factory.create = jest.fn();

    mockClosingPeriodRepository = {} as ClosingPeriodRepository;
    mockClosingPeriodRepository.save = jest.fn();

    addNewClosingPeriod = new AddNewClosingPeriod(mockClosingPeriodRepository);
  });

  describe('execute()', () => {
    it('should create new closingPeriod using command', async () => {
      // given
      const newClosingPeriodCommand: NewClosingPeriodCommand = {
        startDate: new Date('2020-06-13T04:41:20'),
        endDate: new Date('2030-06-13T04:41:20'),
      };

      // when
      await addNewClosingPeriod.execute(newClosingPeriodCommand);

      // then
      expect(ClosingPeriod.factory.create).toHaveBeenCalledWith(newClosingPeriodCommand);
    });

    it('should save created closingPeriod', async () => {
      // given
      const createdClosingPeriod: ClosingPeriod = { startDate: new Date('2020-06-13T04:41:20') } as ClosingPeriod;
      (ClosingPeriod.factory.create as jest.Mock).mockReturnValue(createdClosingPeriod);

      // when
      await addNewClosingPeriod.execute({} as NewClosingPeriodCommand);

      // then
      expect(mockClosingPeriodRepository.save).toHaveBeenCalledWith(createdClosingPeriod);
    });
  });
});
