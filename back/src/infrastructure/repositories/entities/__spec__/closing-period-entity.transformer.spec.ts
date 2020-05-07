import { ClosingPeriodInterface } from '../../../../domain/closing-period/closing-period.interface';
import { ClosingPeriodEntityTransformer } from '../closing-period-entity.transformer';
import { ClosingPeriodEntity } from '../closing-period.entity';

describe('infrastructure/repositories/entities/ClosingPeriodEntityTransformer', () => {
  let closingPeriodEntityTransformer: ClosingPeriodEntityTransformer;
  beforeEach(() => {
    closingPeriodEntityTransformer = new ClosingPeriodEntityTransformer();
  });

  describe('from()', () => {
    it('should transform ClosingPeriodEntity to ClosingPeriodInterface', () => {
      // given
      const closingPeriodEntity: ClosingPeriodEntity = {
        id: 42,
        startDate: new Date('2020-06-13T04:41:20'),
        endDate: new Date('2030-06-13T04:41:20'),
      } as ClosingPeriodEntity;

      // when
      const result: ClosingPeriodInterface = closingPeriodEntityTransformer.from(closingPeriodEntity);

      // then
      expect(result).toStrictEqual({
        id: 42,
        startDate: new Date('2020-06-13T04:41:20'),
        endDate: new Date('2030-06-13T04:41:20'),
      } as ClosingPeriodInterface);
    });
  });

  describe('to()', () => {
    it('should transform ClosingPeriodInterface to ClosingPeriodEntity', () => {
      // given
      const closingPeriod: ClosingPeriodInterface = {
        id: 42,
        startDate: new Date('2020-06-13T04:41:20'),
        endDate: new Date('2030-06-13T04:41:20'),
      };

      // when
      const result: ClosingPeriodEntity = closingPeriodEntityTransformer.to(closingPeriod);

      // then
      expect(result).toMatchObject({
        id: 42,
        startDate: new Date('2020-06-13T04:41:20'),
        endDate: new Date('2030-06-13T04:41:20'),
      } as ClosingPeriodEntity);
    });
  });
});
