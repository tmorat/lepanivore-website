import { FeatureId } from '../type-aliases';
import { FeatureInterface } from './feature.interface';

export interface FeatureRepository {
  save(feature: FeatureInterface): Promise<FeatureId>;
  findByName(name: string): Promise<FeatureInterface>;
}
