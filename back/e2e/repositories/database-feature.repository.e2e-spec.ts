import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { FeatureNotFoundError } from '../../src/domain/feature-not-found.error';
import { FeatureStatus } from '../../src/domain/feature-status';
import { FeatureInterface } from '../../src/domain/feature.interface';
import { FeatureId } from '../../src/domain/type-aliases';
import { EnvironmentConfigService } from '../../src/infrastructure/config/environment-config/environment-config.service';
import { DatabaseFeatureRepository } from '../../src/infrastructure/repositories/database-feature.repository';
import { FeatureEntity } from '../../src/infrastructure/repositories/entities/feature.entity';
import { RepositoriesModule } from '../../src/infrastructure/repositories/repositories.module';
import { e2eEnvironmentConfigService } from '../e2e-config';
import { runDatabaseMigrations } from './database-e2e.utils';

describe('infrastructure/repositories/DatabaseFeatureRepository', () => {
  let app: INestApplication;
  let databaseFeatureRepository: DatabaseFeatureRepository;
  let featureEntityRepository: Repository<FeatureEntity>;
  let featureWithoutId: FeatureInterface;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [RepositoriesModule],
    })
      .overrideProvider(EnvironmentConfigService)
      .useValue(e2eEnvironmentConfigService)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    await runDatabaseMigrations(app.get(EnvironmentConfigService));

    databaseFeatureRepository = app.get(DatabaseFeatureRepository);
    // @ts-ignore
    featureEntityRepository = databaseFeatureRepository.featureEntityRepository;
  });

  describe('migrations', () => {
    it('should have PRODUCT_ORDERING feature inserted by default with status ENABLED', async () => {
      // when
      const feature: FeatureInterface = await databaseFeatureRepository.findByName('PRODUCT_ORDERING');

      // then
      expect(feature.status).toBe(FeatureStatus.ENABLED);
    });
  });

  describe('repository', () => {
    beforeEach(async () => {
      await featureEntityRepository.clear();

      featureWithoutId = {
        name: 'feature name',
        status: FeatureStatus.ENABLED,
      } as FeatureInterface;
    });

    describe('save()', () => {
      it('should persist feature in database', async () => {
        // when
        await databaseFeatureRepository.save(featureWithoutId);

        // then
        const count: number = await featureEntityRepository.count();
        expect(count).toBe(1);
      });

      it('should return saved feature with an id', async () => {
        // when
        const result: FeatureId = await databaseFeatureRepository.save(featureWithoutId);

        // then
        expect(result).toBeDefined();
      });
    });

    describe('findByName()', () => {
      it('should return found feature in database', async () => {
        // given
        await databaseFeatureRepository.save(featureWithoutId);
        const featureWithoutIdAndDifferentName: FeatureInterface = { ...featureWithoutId, name: 'another feature' };
        const savedFeatureIdDifferentName: FeatureId = await databaseFeatureRepository.save(featureWithoutIdAndDifferentName);

        // when
        const result: FeatureInterface = await databaseFeatureRepository.findByName('another feature');

        // then
        expect(result.id).toBe(savedFeatureIdDifferentName);
        expect(result).toMatchObject(featureWithoutIdAndDifferentName);
      });

      it('should throw exception when feature not found in database', async () => {
        // given
        const name: string = 'unknown-feature-name';

        // when
        const result: Promise<FeatureInterface> = databaseFeatureRepository.findByName(name);

        // then
        await expect(result).rejects.toThrow(new FeatureNotFoundError(`Feature not found with name "${name}"`));
      });
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
