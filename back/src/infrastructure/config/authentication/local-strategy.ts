import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { compare } from 'bcrypt';
import { Strategy } from 'passport-local';
import { ADMIN, User } from '../../../domain/user/user';
import { EnvironmentConfigService } from '../environment-config/environment-config.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly environmentConfigService: EnvironmentConfigService) {
    super();
  }

  async validate(username: string, password: string): Promise<User> {
    const isAdminUsername: boolean = username === this.environmentConfigService.get('APP_ADMIN_USERNAME');
    const isAdminPassword: boolean = await compare(password, this.environmentConfigService.get('APP_ADMIN_ENCRYPTED_PASSWORD'));
    const isAdmin: boolean = isAdminUsername && isAdminPassword;
    if (!isAdmin) {
      return Promise.reject(new UnauthorizedException());
    }

    return ADMIN;
  }
}
