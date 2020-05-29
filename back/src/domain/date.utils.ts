import { cloneDeep } from 'lodash';

export const isFirstDateBeforeSecondDateIgnoringHours = (firstDate: Date, secondDate: Date): boolean => {
  const secondDateCopy: Date = cloneDeep(secondDate);
  secondDateCopy.setHours(firstDate.getHours(), firstDate.getMinutes(), firstDate.getSeconds(), firstDate.getMilliseconds());

  return firstDate.getTime() < secondDateCopy.getTime();
};

export const getNumberOfDaysBetweenFirstDateAndSecondDate = (firstDate: Date, secondDate: Date): number => {
  return Math.ceil(Math.abs(firstDate.getTime() - secondDate.getTime()) / (1000 * 60 * 60 * 24));
};

export const NUMBER_OF_DAYS_IN_A_WEEK: number = 7;

export enum Day {
  SUNDAY = 0,
  MONDAY = 1,
  TUESDAY = 2,
  WEDNESDAY = 3,
  THURSDAY = 4,
  FRIDAY = 5,
  SATURDAY = 6,
}
