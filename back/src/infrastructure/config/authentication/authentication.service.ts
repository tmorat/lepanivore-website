import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ADMIN } from '../../../domain/user/user';

@Injectable()
export class AuthenticationService {
  constructor(private readonly jwtService: JwtService) {}

  generateAdminJwt(): string {
    return this.jwtService.sign(ADMIN);
  }
}
