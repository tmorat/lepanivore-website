import { cloneDeep, isEmpty } from 'lodash';
import { FeatureId } from '../type-aliases';
import { FeatureStatus } from './feature-status';
import { FeatureInterface } from './feature.interface';

export class Feature implements FeatureInterface {
  static factory: FeatureFactoryInterface = {
    create(): Feature {
      return new Feature({} as FeatureInterface);
    },
    copy(feature: FeatureInterface): Feature {
      return new Feature(feature);
    },
  };
  static PRODUCT_ORDERING_FEATURE_NAME: string = 'PRODUCT_ORDERING';

  id: FeatureId;
  name: string;
  status: FeatureStatus;

  private constructor(feature: FeatureInterface) {
    if (!isEmpty(feature)) {
      this.copy(feature);
    }
  }

  enable(): void {
    this.status = FeatureStatus.ENABLED;
  }

  disable(): void {
    this.status = FeatureStatus.DISABLED;
  }

  private copy(otherFeature: FeatureInterface): void {
    const deepCloneOfOtherFeature: FeatureInterface = cloneDeep(otherFeature);
    for (const field in deepCloneOfOtherFeature) {
      if (deepCloneOfOtherFeature.hasOwnProperty(field)) {
        this[field] = deepCloneOfOtherFeature[field];
      }
    }
  }
}

export interface FeatureFactoryInterface {
  create(): Feature;

  copy(feature: FeatureInterface): Feature;
}
