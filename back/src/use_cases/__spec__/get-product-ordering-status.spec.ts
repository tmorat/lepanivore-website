import { FeatureInterface } from '../../domain/feature.interface';
import { FeatureRepository } from '../../domain/feature.repository';
import { GetProductOrderingStatus } from '../get-product-ordering-status';

describe('uses_cases/GetProductOrderingStatus', () => {
  let getProductOrderingStatus: GetProductOrderingStatus;
  let mockFeatureRepository: FeatureRepository;

  beforeEach(() => {
    mockFeatureRepository = {} as FeatureRepository;
    mockFeatureRepository.findByName = jest.fn();

    getProductOrderingStatus = new GetProductOrderingStatus(mockFeatureRepository);
  });

  describe('execute()', () => {
    it('should search for product ordering feature', async () => {
      // when
      await getProductOrderingStatus.execute();

      // then
      expect(mockFeatureRepository.findByName).toHaveBeenCalledWith('PRODUCT_ORDERING');
    });

    it('should return found feature', async () => {
      // given
      const existingFeature: FeatureInterface = { name: 'PRODUCT_ORDERING' } as FeatureInterface;
      (mockFeatureRepository.findByName as jest.Mock).mockReturnValue(Promise.resolve(existingFeature));

      // when
      const result: FeatureInterface = await getProductOrderingStatus.execute();

      // then
      expect(result).toBe(existingFeature);
    });
  });
});
