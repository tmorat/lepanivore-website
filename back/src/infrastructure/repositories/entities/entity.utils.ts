import { isEmpty } from 'lodash';
import { ValueTransformer } from 'typeorm';

export const DATE_MAX_LENGTH: number = 24;
export const ENUM_VALUE_MAX_LENGTH: number = 8;
export const DEFAULT_MAX_LENGTH: number = 255;

const ARRAY_ITEM_SEPARATOR: string = '|||';

export const dateIsoStringValueTransformer: ValueTransformer = {
  from: (dateAsISOString: string): Date => {
    return dateAsISOString ? new Date(dateAsISOString) : undefined;
  },
  to: (date: Date): string => {
    return date ? date.toISOString() : undefined;
  },
} as ValueTransformer;

export const arrayValueTransformer: ValueTransformer = {
  from: (stringWithSeparators: string): string[] => {
    return isEmpty(stringWithSeparators) ? null : stringWithSeparators.split(ARRAY_ITEM_SEPARATOR);
  },
  to: (array: string[]): string => {
    return isEmpty(array) ? null : array.join(ARRAY_ITEM_SEPARATOR);
  },
} as ValueTransformer;
