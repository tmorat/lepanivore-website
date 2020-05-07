import { Injectable } from '@nestjs/common';
import { ValueTransformer } from 'typeorm';
import { FeatureStatus } from '../../../domain/feature-status';
import { FeatureInterface } from '../../../domain/feature.interface';
import { FeatureEntity } from './feature.entity';

@Injectable()
export class FeatureEntityTransformer implements ValueTransformer {
  from(featureEntity: FeatureEntity): FeatureInterface {
    return {
      id: featureEntity.id,
      name: featureEntity.name,
      status: featureEntity.status as FeatureStatus,
    };
  }

  to(feature: FeatureInterface): FeatureEntity {
    const featureEntity: FeatureEntity = new FeatureEntity();
    featureEntity.id = feature.id;
    featureEntity.name = feature.name;
    featureEntity.status = feature.status;

    return featureEntity;
  }
}
