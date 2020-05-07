import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClosingPeriodNotFoundError } from '../../domain/closing-period-not-found.error';
import { ClosingPeriodInterface } from '../../domain/closing-period.interface';
import { ClosingPeriodRepository } from '../../domain/closing-period.repository';
import { ClosingPeriodId } from '../../domain/type-aliases';
import { ClosingPeriodEntityTransformer } from './entities/closing-period-entity.transformer';
import { ClosingPeriodEntity } from './entities/closing-period.entity';

@Injectable()
export class DatabaseClosingPeriodRepository implements ClosingPeriodRepository {
  constructor(
    @InjectRepository(ClosingPeriodEntity) private readonly closingPeriodEntityRepository: Repository<ClosingPeriodEntity>,
    private readonly closingPeriodEntityTransformer: ClosingPeriodEntityTransformer
  ) {}

  async save(closingPeriod: ClosingPeriodInterface): Promise<ClosingPeriodId> {
    const closingPeriodEntity: ClosingPeriodEntity = this.closingPeriodEntityTransformer.to(closingPeriod);
    const savedClosingPeriodEntity: ClosingPeriodEntity = await this.closingPeriodEntityRepository.save(closingPeriodEntity);

    return Promise.resolve(savedClosingPeriodEntity.id);
  }

  async delete(closingPeriod: ClosingPeriodInterface): Promise<void> {
    await this.closingPeriodEntityRepository.delete(closingPeriod.id);
  }

  async findById(closingPeriodId: ClosingPeriodId): Promise<ClosingPeriodInterface> {
    const foundClosingPeriodEntity: ClosingPeriodEntity = await this.closingPeriodEntityRepository.findOne({ where: { id: closingPeriodId } });
    if (!foundClosingPeriodEntity) {
      return Promise.reject(new ClosingPeriodNotFoundError(`ClosingPeriod not found with id "${closingPeriodId}"`));
    }

    return Promise.resolve(this.closingPeriodEntityTransformer.from(foundClosingPeriodEntity));
  }

  async findAll(): Promise<ClosingPeriodInterface[]> {
    const foundClosingPeriodEntities: ClosingPeriodEntity[] = await this.closingPeriodEntityRepository.find();
    const result: ClosingPeriodInterface[] = foundClosingPeriodEntities.map((closingPeriodEntity: ClosingPeriodEntity) =>
      this.closingPeriodEntityTransformer.from(closingPeriodEntity)
    );

    return Promise.resolve(result);
  }
}
