import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { AuthService } from './auth.service';

import { RequestWithTokenInterface } from './interfaces/requestWithToken.interface';

import { AuthEntity } from './entities/auth.entity';
import { BlacklistEntity } from './entities/blacklist.entity';

import { LoginDto } from './dtos/login.dto';
import { LogoutDto } from './dtos/logout.dto';
import { SignupDto, SignupOneDto } from './dtos/signup.dto';
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

  @Post('validate/account')
  async validateAccountData(@Body() body: SignupOneDto) {
    return this.authService.validateSignup(body, 1);
  }

  @Post('validate/personal')
  async validatePersonalData(@Body() body: SignupDto) {
    return this.authService.validateSignup(body, 2);
  }

  @Post('signup')
  @ApiOkResponse({
    type: AuthEntity,
  })
  async signup(@Body() body: SignupDto) {
    return this.authService.signup(body);
  }

  @Post('logout')
  @UseGuards(RefreshJwtGuard)
  @ApiBearerAuth('refresh-token')
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
    return this.authService.refreshTokens(req.user.id, req.user.tokenId);
  }

  @Get('blacklist')
  @ApiOkResponse({
    type: [BlacklistEntity],
  })
  async blacklist() {
    return this.authService.getBlockedTokens();
  }
}
