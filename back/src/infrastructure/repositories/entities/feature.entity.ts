import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { DEFAULT_MAX_LENGTH, ENUM_VALUE_MAX_LENGTH } from './entity.utils';

@Entity({ name: 'feature' })
export class FeatureEntity {
  @PrimaryGeneratedColumn('increment', { name: 'id' })
  id: number;

  @Column({ name: 'name', type: 'varchar', nullable: false, length: DEFAULT_MAX_LENGTH })
  name: string;

  @Column({ name: 'status', type: 'varchar', nullable: false, length: ENUM_VALUE_MAX_LENGTH })
  status: string;
}
