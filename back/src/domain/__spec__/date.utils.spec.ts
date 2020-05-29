import { getNumberOfDaysBetweenFirstDateAndSecondDate, isFirstDateBeforeSecondDateIgnoringHours } from '../date.utils';

describe('domain/date.utils', () => {
  describe('isFirstDateBeforeSecondDateIgnoringHours()', () => {
    it('should return true when first date is before second date', () => {
      // given
      const firstDate: Date = new Date('2030-06-13T04:41:20');
      const secondDate: Date = new Date('2030-06-14T04:41:20');

      // when
      const result: boolean = isFirstDateBeforeSecondDateIgnoringHours(firstDate, secondDate);

      // then
      expect(result).toBe(true);
    });

    it('should return false when first date equals second date', () => {
      // given
      const firstDate: Date = new Date('2030-06-14T04:41:20');
      const secondDate: Date = new Date('2030-06-14T04:41:20');

      // when
      const result: boolean = isFirstDateBeforeSecondDateIgnoringHours(firstDate, secondDate);

      // then
      expect(result).toBe(false);
    });

    it('should return false when first date is after second date', () => {
      // given
      const firstDate: Date = new Date('2030-06-15T04:41:20');
      const secondDate: Date = new Date('2030-06-14T04:41:20');

      // when
      const result: boolean = isFirstDateBeforeSecondDateIgnoringHours(firstDate, secondDate);

      // then
      expect(result).toBe(false);
    });

    it('should return false when first date is before second date but at same date and different time', () => {
      // given
      const firstDate: Date = new Date('2030-06-14T04:41:19');
      const secondDate: Date = new Date('2030-06-14T04:41:20');

      // when
      const result: boolean = isFirstDateBeforeSecondDateIgnoringHours(firstDate, secondDate);

      // then
      expect(result).toBe(false);
    });

    it('should not modify given dates', () => {
      // given
      const firstDate: Date = new Date('2030-06-13T04:41:20');
      const secondDate: Date = new Date('2030-06-14T04:41:20');

      // when
      isFirstDateBeforeSecondDateIgnoringHours(firstDate, secondDate);

      // then
      expect(firstDate.toISOString()).toStrictEqual('2030-06-13T08:41:20.000Z');
      expect(secondDate.toISOString()).toStrictEqual('2030-06-14T08:41:20.000Z');
    });
  });

  describe('getNumberOfDaysBetweenFirstDateAndSecondDate()', () => {
    it('should return 0 when the two dates are the same', () => {
      // given
      const firstDate: Date = new Date('2030-06-14T04:41:20');
      const secondDate: Date = new Date('2030-06-14T04:41:20');

      // when
      const result: number = getNumberOfDaysBetweenFirstDateAndSecondDate(firstDate, secondDate);

      // then
      expect(result).toBe(0);
    });

    it('should return 1 when the two dates are exactly separated with 24 hours', () => {
      // given
      const firstDate: Date = new Date('2030-06-13T04:41:20');
      const secondDate: Date = new Date('2030-06-14T04:41:20');

      // when
      const result: number = getNumberOfDaysBetweenFirstDateAndSecondDate(firstDate, secondDate);

      // then
      expect(result).toBe(1);
    });

    it('should return 2 when the two dates are separated with more than 24 hours but less than 48 hours', () => {
      // given
      const firstDate: Date = new Date('2030-06-13T04:41:20');
      const secondDate: Date = new Date('2030-06-14T04:41:21');

      // when
      const result: number = getNumberOfDaysBetweenFirstDateAndSecondDate(firstDate, secondDate);

      // then
      expect(result).toBe(2);
    });

    it('should not modify given dates', () => {
      // given
      const firstDate: Date = new Date('2030-06-13T04:41:20');
      const secondDate: Date = new Date('2030-06-14T04:41:20');

      // when
      getNumberOfDaysBetweenFirstDateAndSecondDate(firstDate, secondDate);

      // then
      expect(firstDate.toISOString()).toStrictEqual('2030-06-13T08:41:20.000Z');
      expect(secondDate.toISOString()).toStrictEqual('2030-06-14T08:41:20.000Z');
    });
  });
});
