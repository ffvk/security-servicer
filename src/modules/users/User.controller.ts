import { Controller, Get, Query, NotFoundException, Res } from '@nestjs/common';
import { ApiTags, ApiQuery } from '@nestjs/swagger';
import { UsersService } from './User.service';
import type { Response } from 'express'; // ✅ use type-only import

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
    @Res() res: Response, // Express Response
  ) {
    const user = await this.usersService.findByTokenAndRealm(token, realm);
    if (!user) throw new NotFoundException('User not found');


       // Extract login data from login API response
    const loginData = user.loginData; // { userId, access_token, refresh_token, ... }

    // Set cookies (example: HttpOnly + secure if needed)
    res.cookie('user', user.username, { httpOnly: false }); // not sensitive
    res.cookie('userId', loginData.userId, { httpOnly: false });
    res.cookie('access_token', loginData.access_token, { httpOnly: true, secure: true });
    res.cookie('refresh_token', loginData.refresh_token, { httpOnly: true, secure: true });


    // Redirect browser to dashboard
    return res.redirect(user.redirecUrl!); // or use fallback
  }
}
