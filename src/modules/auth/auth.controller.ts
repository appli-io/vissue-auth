import { Controller, Logger, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService }                                  from './auth.service';
import { LocalAuthGuard }                       from './local-auth.guard';

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('auth')
  async login(@Request() req) {
    Logger.debug(req.user);
    return this.authService.login(req.user);
  }
}
