import { FeatureStatus } from '../../../../domain/feature/feature-status';
import { FeatureInterface } from '../../../../domain/feature/feature.interface';
import { FeatureEntityTransformer } from '../feature-entity.transformer';
import { FeatureEntity } from '../feature.entity';

describe('infrastructure/repositories/entities/FeatureEntityTransformer', () => {
  let featureEntityTransformer: FeatureEntityTransformer;
  beforeEach(() => {
    featureEntityTransformer = new FeatureEntityTransformer();
  });

  describe('from()', () => {
    it('should transform FeatureEntity to FeatureInterface', () => {
      // given
      const featureEntity: FeatureEntity = {
        id: 42,
        name: 'feature name',
        status: FeatureStatus.ENABLED,
      } as FeatureEntity;

      // when
      const result: FeatureInterface = featureEntityTransformer.from(featureEntity);

      // then
      expect(result).toStrictEqual({
        id: 42,
        name: 'feature name',
        status: FeatureStatus.ENABLED,
      } as FeatureInterface);
    });
  });

  describe('to()', () => {
    it('should transform FeatureInterface to FeatureEntity', () => {
      // given
      const feature: FeatureInterface = {
        id: 42,
        name: 'feature name',
        status: FeatureStatus.ENABLED,
      };

      // when
      const result: FeatureEntity = featureEntityTransformer.to(feature);

      // then
      expect(result).toMatchObject({
        id: 42,
        name: 'feature name',
        status: 'ENABLED',
      } as FeatureEntity);
    });
  });
});
