import { Feature, FeatureFactoryInterface } from '../../domain/feature';
import { FeatureInterface } from '../../domain/feature.interface';
import { FeatureRepository } from '../../domain/feature.repository';
import { EnableProductOrdering } from '../enable-product-ordering';

describe('uses_cases/EnableProductOrdering', () => {
  let enableProductOrdering: EnableProductOrdering;
  let mockFeatureRepository: FeatureRepository;
  let featureToEnable: Feature;

  beforeEach(() => {
    Feature.factory = {} as FeatureFactoryInterface;
    Feature.factory.copy = jest.fn();

    featureToEnable = { name: 'fake feature' } as Feature;
    featureToEnable.enable = jest.fn();
    (Feature.factory.copy as jest.Mock).mockReturnValue(featureToEnable);

    mockFeatureRepository = {} as FeatureRepository;
    mockFeatureRepository.save = jest.fn();
    mockFeatureRepository.findByName = jest.fn();

    enableProductOrdering = new EnableProductOrdering(mockFeatureRepository);
  });

  describe('execute()', () => {
    it('should search for product ordering feature', async () => {
      // when
      await enableProductOrdering.execute();

      // then
      expect(mockFeatureRepository.findByName).toHaveBeenCalledWith('PRODUCT_ORDERING');
    });

    it('should copy found feature in order to enable it', async () => {
      // given
      const existingFeature: FeatureInterface = { name: 'PRODUCT_ORDERING' } as FeatureInterface;
      (mockFeatureRepository.findByName as jest.Mock).mockReturnValue(Promise.resolve(existingFeature));

      // when
      await enableProductOrdering.execute();

      // then
      expect(Feature.factory.copy).toHaveBeenCalledWith(existingFeature);
    });

    it('should enable feature', async () => {
      // when
      await enableProductOrdering.execute();

      // then
      expect(featureToEnable.enable).toHaveBeenCalled();
    });

    it('should save enabled feature', async () => {
      // when
      await enableProductOrdering.execute();

      // then
      expect(mockFeatureRepository.save).toHaveBeenCalledWith(featureToEnable);
    });
  });
});
