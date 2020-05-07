import { FeatureInterface } from './feature.interface';
import { FeatureId } from './type-aliases';

export interface FeatureRepository {
  save(feature: FeatureInterface): Promise<FeatureId>;
  findByName(name: string): Promise<FeatureInterface>;
}
