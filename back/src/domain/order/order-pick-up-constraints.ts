import { Day } from '../date.constants';

export interface AvailableDayForAPickUpOrder {
  whenOrderIsPlacedOn: Day;
  firstAvailableDay: Day;
}

export const AVAILABLE_DAYS_FOR_A_PICK_UP_ORDER: AvailableDayForAPickUpOrder[] = [
  { whenOrderIsPlacedOn: Day.SUNDAY, firstAvailableDay: Day.TUESDAY },
  { whenOrderIsPlacedOn: Day.MONDAY, firstAvailableDay: Day.THURSDAY },
  { whenOrderIsPlacedOn: Day.TUESDAY, firstAvailableDay: Day.THURSDAY },
  { whenOrderIsPlacedOn: Day.WEDNESDAY, firstAvailableDay: Day.SATURDAY },
  { whenOrderIsPlacedOn: Day.THURSDAY, firstAvailableDay: Day.SATURDAY },
  { whenOrderIsPlacedOn: Day.FRIDAY, firstAvailableDay: Day.TUESDAY },
  { whenOrderIsPlacedOn: Day.SATURDAY, firstAvailableDay: Day.TUESDAY },
];

export const CLOSING_DAYS: Day[] = [Day.SUNDAY, Day.MONDAY];
