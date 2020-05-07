import { FeatureStatus } from './feature-status';
import { FeatureId } from './type-aliases';

export interface FeatureInterface {
  id: FeatureId;
  name: string;
  status: FeatureStatus;
}
