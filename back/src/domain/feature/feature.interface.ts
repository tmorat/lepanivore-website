import { FeatureId } from '../type-aliases';
import { FeatureStatus } from './feature-status';

export interface FeatureInterface {
  id: FeatureId;
  name: string;
  status: FeatureStatus;
}
