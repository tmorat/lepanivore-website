import { Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthenticationService } from '../config/authentication/authentication.service';
import { PostLoginResponse } from './models/post-login-response';

@Controller('/api/authentication')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @UseGuards(AuthGuard('local'))
  @Post('/login')
  @HttpCode(200)
  async login(): Promise<PostLoginResponse> {
    return {
      accessToken: this.authenticationService.generateAdminJwt(),
    };
  }
}
