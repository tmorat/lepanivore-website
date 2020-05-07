import { Feature } from '../domain/feature';
import { FeatureInterface } from '../domain/feature.interface';
import { FeatureRepository } from '../domain/feature.repository';

export class GetProductOrderingStatus {
  constructor(private readonly featureRepository: FeatureRepository) {}

  async execute(): Promise<FeatureInterface> {
    return this.featureRepository.findByName(Feature.PRODUCT_ORDERING_FEATURE_NAME);
  }
}
