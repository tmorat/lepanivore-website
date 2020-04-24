import { ClosingPeriodInterface } from '../../domain/closing-period.interface';
import { ClosingPeriodRepository } from '../../domain/closing-period.repository';
import { GetClosingPeriods } from '../get-closing-periods';

describe('use_cases/GetClosingPeriods', () => {
  let getClosingPeriods: GetClosingPeriods;
  let mockClosingPeriodRepository: ClosingPeriodRepository;

  beforeEach(() => {
    mockClosingPeriodRepository = {} as ClosingPeriodRepository;
    mockClosingPeriodRepository.findAll = jest.fn();

    getClosingPeriods = new GetClosingPeriods(mockClosingPeriodRepository);
  });

  describe('execute()', () => {
    it('should return found closing periods', async () => {
      // given
      const closingPeriods: ClosingPeriodInterface[] = [
        { start: new Date('2020-07-01T12:00:00Z'), end: new Date('2020-08-15T12:00:00Z') },
        { start: new Date('2020-12-15T12:00:00Z'), end: new Date('2021-01-02T12:00:00Z') },
      ];
      (mockClosingPeriodRepository.findAll as jest.Mock).mockReturnValue(Promise.resolve(closingPeriods));

      // when
      const result: ClosingPeriodInterface[] = await getClosingPeriods.execute();

      // then
      expect(result).toStrictEqual(closingPeriods);
    });
  });
});
