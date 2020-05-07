import { Feature } from '../feature';
import { FeatureStatus } from '../feature-status';
import { FeatureInterface } from '../feature.interface';

describe('domain/feature/Feature', () => {
  describe('factory', () => {
    describe('copy()', () => {
      it('should create a new instance as a copy of given feature', () => {
        // given
        const featureToCopy: FeatureInterface = {
          id: 42,
          name: 'FEATURE_NAME',
          status: FeatureStatus.ENABLED,
        };

        // when
        const result: Feature = Feature.factory.copy(featureToCopy);

        // then
        expect(result).toMatchObject(featureToCopy);
        expect(result.enable).toBeDefined();
        expect(result.disable).toBeDefined();
      });
    });
  });

  describe('enable()', () => {
    it('should set status to ENABLED', () => {
      // given
      const feature: Feature = Feature.factory.create();

      // when
      feature.enable();

      // then
      expect(feature.status).toBe(FeatureStatus.ENABLED);
    });
  });

  describe('disable()', () => {
    it('should set status to DISABLED', () => {
      // given
      const feature: Feature = Feature.factory.create();

      // when
      feature.disable();

      // then
      expect(feature.status).toBe(FeatureStatus.DISABLED);
    });
  });
});
