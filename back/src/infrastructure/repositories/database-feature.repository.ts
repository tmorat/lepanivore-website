import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FeatureNotFoundError } from '../../domain/feature-not-found.error';
import { FeatureInterface } from '../../domain/feature.interface';
import { FeatureRepository } from '../../domain/feature.repository';
import { FeatureId } from '../../domain/type-aliases';
import { FeatureEntityTransformer } from './entities/feature-entity.transformer';
import { FeatureEntity } from './entities/feature.entity';

@Injectable()
export class DatabaseFeatureRepository implements FeatureRepository {
  constructor(
    @InjectRepository(FeatureEntity) private readonly featureEntityRepository: Repository<FeatureEntity>,
    private readonly featureEntityTransformer: FeatureEntityTransformer
  ) {}

  async save(feature: FeatureInterface): Promise<FeatureId> {
    const featureEntity: FeatureEntity = this.featureEntityTransformer.to(feature);
    const savedFeatureEntity: FeatureEntity = await this.featureEntityRepository.save(featureEntity);

    return Promise.resolve(savedFeatureEntity.id);
  }

  async findByName(name: string): Promise<FeatureInterface> {
    const foundFeatureEntity: FeatureEntity = await this.featureEntityRepository.findOne({ where: { name } });
    if (!foundFeatureEntity) {
      return Promise.reject(new FeatureNotFoundError(`Feature not found with name "${name}"`));
    }

    return Promise.resolve(this.featureEntityTransformer.from(foundFeatureEntity));
  }
}
