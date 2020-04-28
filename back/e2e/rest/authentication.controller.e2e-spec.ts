import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request, { Response } from 'supertest';
import { EnvironmentConfigService } from '../../src/infrastructure/config/environment-config/environment-config.service';
import { RestModule } from '../../src/infrastructure/rest/rest.module';
import { ADMIN_E2E_PASSWORD, ADMIN_E2E_USERNAME, e2eEnvironmentConfigService } from '../e2e-config';
import DoneCallback = jest.DoneCallback;

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

  describe('GET /api/authentication/profile', () => {
    it('should return OK with admin user profile', (done: DoneCallback) => {
      // given
      const loginRequest: request.Test = request(app.getHttpServer()).post('/api/authentication/login').send({
        username: ADMIN_E2E_USERNAME,
        password: ADMIN_E2E_PASSWORD,
      });

      let accessToken: string;
      loginRequest
        .expect(200)
        .expect((loginResponse: Response) => {
          accessToken = loginResponse.body.accessToken;
        })
        .end(() => {
          // when
          const testRequest: request.Test = request(app.getHttpServer())
            .get('/api/authentication/profile')
            .set({ Authorization: `Bearer ${accessToken}` });

          // then
          testRequest
            .expect(200)
            .expect((response: Response) => {
              expect(response.body).toStrictEqual({
                username: 'ADMIN',
              });
            })
            .end(done);
        });
    });

    it('should return http status code Unauthorized when not authenticated as admin', () => {
      // when
      const testRequestWithoutAuthorizationHeader: request.Test = request(app.getHttpServer()).get('/api/authentication/profile');

      // then
      return testRequestWithoutAuthorizationHeader.expect(401);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
