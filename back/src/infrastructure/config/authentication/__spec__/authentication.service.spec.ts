import { JwtService } from '@nestjs/jwt';
import { ADMIN } from '../../../../domain/user';
import { AuthenticationService } from '../authentication.service';

describe('infrastructure/config/authentication/AuthenticationService', () => {
  let authenticationService: AuthenticationService;
  let mockJwtService: JwtService;

  beforeEach(() => {
    mockJwtService = {} as JwtService;
    mockJwtService.sign = jest.fn();

    authenticationService = new AuthenticationService(mockJwtService);
  });

  describe('generateAdminJwt()', () => {
    it('should generate jwt for ADMIN user', () => {
      // when
      authenticationService.generateAdminJwt();

      // then
      expect(mockJwtService.sign).toHaveBeenCalledWith({ username: 'ADMIN' });
    });

    it('should return generated jwt', () => {
      // given
      (mockJwtService.sign as jest.Mock).mockReturnValue('hashed-password');

      // when
      const result: string = authenticationService.generateAdminJwt();

      // then
      expect(result).toBe('hashed-password');
    });
  });
});
