import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { AuthService } from './auth.service';

import { RequestWithTokenInterface } from './interfaces/requestWithToken.interface';

import { AuthEntity } from './entities/auth.entity';
import { BlacklistEntity } from './entities/blacklist.entity';

import { LoginDto } from './dtos/login.dto';
import { LogoutDto } from './dtos/logout.dto';
import { SingupDto } from './dtos/singup.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { RefreshJwtGuard } from './guards/refresh-jwt.guard';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @ApiOkResponse({
    type: AuthEntity,
  })
  async login(@Body() { email, password }: LoginDto) {
    return this.authService.login(email, password);
  }

  @Post('signup')
  @ApiOkResponse({
    type: AuthEntity,
  })
  async signup(@Body() body: SingupDto) {
    return this.authService.signup(body);
  }

  @Post('logout')
  @ApiOkResponse({
    type: AuthEntity,
  })
  async logout(
    @Body()
    { accessToken, refreshToken }: LogoutDto,
  ) {
    return this.authService.logout(accessToken, refreshToken);
  }

  @Get('refresh')
  @UseGuards(RefreshJwtGuard)
  @ApiOkResponse({
    type: AuthEntity,
  })
  async refreshToken(@Request() req: RequestWithTokenInterface) {
    const authorization = req.headers.get('authorization');

    if (!authorization) {
      throw new UnauthorizedException('NO_TOKEN_PROVIDED');
    }

    return this.authService.refreshTokens(authorization.split(' ')[1]);
  }

  @Get('blacklist')
  @ApiOkResponse({
    type: [BlacklistEntity],
  })
  async blacklist() {
    return this.authService.getBlockedTokens();
  }
}
