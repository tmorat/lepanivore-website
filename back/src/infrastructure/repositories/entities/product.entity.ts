import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { currencyValueTransformer, DEFAULT_MAX_LENGTH, ENUM_VALUE_MAX_LENGTH } from './entity.utils';

@Entity({ name: 'product' })
export class ProductEntity {
  @PrimaryGeneratedColumn('increment', { name: 'id' })
  id: number;

  @Column({ name: 'name', type: 'varchar', nullable: false, length: DEFAULT_MAX_LENGTH })
  name: string;

  @Column({ name: 'description', type: 'text', nullable: false })
  description: string;

  @Column({ name: 'price', type: 'integer', nullable: false, transformer: currencyValueTransformer })
  price: number;

  @Column({ name: 'status', type: 'varchar', nullable: false, length: ENUM_VALUE_MAX_LENGTH })
  status: string;
}
