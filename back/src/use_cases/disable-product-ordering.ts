import { Feature } from '../domain/feature';
import { FeatureInterface } from '../domain/feature.interface';
import { FeatureRepository } from '../domain/feature.repository';

export class DisableProductOrdering {
  constructor(private readonly featureRepository: FeatureRepository) {}

  async execute(): Promise<void> {
    const feature: FeatureInterface = await this.featureRepository.findByName(Feature.PRODUCT_ORDERING_FEATURE_NAME);
    const featureToUpdate: Feature = Feature.factory.copy(feature);
    featureToUpdate.disable();
    await this.featureRepository.save(featureToUpdate);
  }
}
