import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { DATE_MAX_LENGTH, dateIsoStringValueTransformer } from './entity.utils';

@Entity({ name: 'closing_period' })
export class ClosingPeriodEntity {
  @PrimaryGeneratedColumn('increment', { name: 'id' })
  id: number;

  @Column({
    name: 'start_date',
    type: 'varchar',
    nullable: false,
    length: DATE_MAX_LENGTH,
    transformer: dateIsoStringValueTransformer,
  })
  startDate: Date;

  @Column({
    name: 'end_date',
    type: 'varchar',
    nullable: false,
    length: DATE_MAX_LENGTH,
    transformer: dateIsoStringValueTransformer,
  })
  endDate: Date;
}
