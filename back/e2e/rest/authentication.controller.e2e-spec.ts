import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request, { Response } from 'supertest';
import { EnvironmentConfigService } from '../../src/infrastructure/config/environment-config/environment-config.service';
import { RestModule } from '../../src/infrastructure/rest/rest.module';
import { ADMIN_E2E_PASSWORD, ADMIN_E2E_USERNAME, e2eEnvironmentConfigService } from '../e2e-config';

describe('infrastructure/rest/AuthenticationController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [RestModule],
    })
      .overrideProvider(EnvironmentConfigService)
      .useValue(e2eEnvironmentConfigService)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('POST /api/authentication/login', () => {
    it('should return OK with a JWT access token when username and password are valid', () => {
      // given
      const loginRequest: object = {
        username: ADMIN_E2E_USERNAME,
        password: ADMIN_E2E_PASSWORD,
      };

      // when
      const testRequest: request.Test = request(app.getHttpServer()).post('/api/authentication/login').send(loginRequest);

      // then
      return testRequest.expect(200).expect((response: Response) => {
        expect(response.body.accessToken.length).toBeGreaterThan(0);
      });
    });

    it('should return Unauthorized without any JWT access token when username and password are invalid', () => {
      // given
      const loginRequest: object = {
        username: 'bad-admin-e2e-username',
        password: 'bad-admin-e2e-password',
      };

      // when
      const testRequest: request.Test = request(app.getHttpServer()).post('/api/authentication/login').send(loginRequest);

      // then
      return testRequest.expect(401).expect((response: Response) => {
        expect(response.body.accessToken).toBeUndefined();
      });
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
