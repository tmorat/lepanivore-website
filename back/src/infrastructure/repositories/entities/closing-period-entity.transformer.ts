import { Injectable } from '@nestjs/common';
import { ValueTransformer } from 'typeorm';
import { ClosingPeriodInterface } from '../../../domain/closing-period.interface';
import { ClosingPeriodEntity } from './closing-period.entity';

@Injectable()
export class ClosingPeriodEntityTransformer implements ValueTransformer {
  from(closingPeriodEntity: ClosingPeriodEntity): ClosingPeriodInterface {
    return {
      id: closingPeriodEntity.id,
      startDate: closingPeriodEntity.startDate,
      endDate: closingPeriodEntity.endDate,
    };
  }

  to(closingPeriod: ClosingPeriodInterface): ClosingPeriodEntity {
    const closingPeriodEntity: ClosingPeriodEntity = new ClosingPeriodEntity();
    closingPeriodEntity.id = closingPeriod.id;
    closingPeriodEntity.startDate = closingPeriod.startDate;
    closingPeriodEntity.endDate = closingPeriod.endDate;

    return closingPeriodEntity;
  }
}
