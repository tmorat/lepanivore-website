import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ADMIN, User } from '../../../domain/user';
import { EnvironmentConfigService } from '../environment-config/environment-config.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly environmentConfigService: EnvironmentConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: environmentConfigService.get('APP_JWT_SECRET'),
    });
  }

  async validate(payload: User): Promise<User> {
    if (payload.username !== ADMIN.username) {
      return Promise.reject(new UnauthorizedException());
    }

    return ADMIN;
  }
}
