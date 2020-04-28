import { Controller, Get, HttpCode, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { User } from '../../domain/user';
import { AuthenticationService } from '../config/authentication/authentication.service';
import { PostLoginResponse } from './models/post-login-response';

@Controller('/api/authentication')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @UseGuards(AuthGuard('local'))
  @Post('/login')
  @HttpCode(200)
  async postLogin(): Promise<PostLoginResponse> {
    return {
      accessToken: this.authenticationService.generateAdminJwt(),
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/profile')
  async getProfile(@Req() request: Request): Promise<User> {
    return request.user as User;
  }
}
