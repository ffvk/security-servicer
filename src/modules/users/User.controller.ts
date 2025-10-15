import { Controller, Get, Query, NotFoundException, Res } from '@nestjs/common';
import { ApiTags, ApiQuery } from '@nestjs/swagger';
import { UsersService } from './User.service';
import type { Response } from 'express';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('validate')
  @ApiQuery({ name: 'token', required: true })
  @ApiQuery({ name: 'realm', required: true })
  async validateUser(
    @Query('token') token: string,
    @Query('realm') realm: string,
    @Res() res: Response,
  ) {
    const user = await this.usersService.findByTokenAndRealm(token, realm);
    if (!user) throw new NotFoundException('User not found');

    const loginData = user.loginData; // { userId, access_token, refresh_token, ... }

    // ✅ Set cookies for the dashboard domain
    // Backend must be HTTPS, because secure: true is required
    res.cookie('user', user.username, {
      httpOnly: false,                  // accessible via JS if needed
      secure: true,                     // HTTPS only
      sameSite: 'none',                 // cross-site cookies allowed
      domain: 'dev.singulariswow.com',  // target domain
      path: '/',                        // available on entire domain
    });

    res.cookie('userId', loginData.userId, {
      httpOnly: false,
      secure: true,
      sameSite: 'none',
      domain: 'dev.singulariswow.com',
      path: '/',
    });

    res.cookie('access_token', loginData.access_token, {
      httpOnly: true,                   // not accessible via JS
      secure: true,
      sameSite: 'none',
      domain: 'dev.singulariswow.com',
      path: '/',
    });

    res.cookie('refresh_token', loginData.refresh_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      domain: 'dev.singulariswow.com',
      path: '/',
    });

    // Redirect to dashboard
    return res.redirect(user.redirecUrl || 'https://dev.singulariswow.com/learner/dashboard');
  }
}
