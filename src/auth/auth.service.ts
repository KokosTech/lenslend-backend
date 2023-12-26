import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { compare } from 'bcrypt';
import { v4 as uuid } from 'uuid';
import { plainToClass } from 'class-transformer';

import { UserService } from '../user/user.service';
import { RedisService } from '../redis/redis.service';

import { jwtConstants } from './constants';
import { SingupDto } from './dtos/singup.dto';
import { CreateUserDto } from '../user/dtos/create-user.dto';
import { RefreshTokenInterface } from './interfaces/refreshToken.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
  ) {}

  async validateUser(email: string, pass: string): Promise<unknown> {
    const user = await this.userService.findByEmail(email);

    if (user && (await compare(pass, user.password))) {
      return {
        email: user.email,
        password: user.password,
      };
    }

    return null;
  }

  async login(email: string, password: string) {
    const user = await this.userService.findByEmail(email);

    if (!user) {
      throw new NotFoundException('NO_USER_FOUND');
    }

    if (!(await compare(password, user.password))) {
      throw new UnauthorizedException('INVALID_PASSWORD');
    }

    return {
      access_token: this.jwtService.sign({
        id: user.uuid,
      }),
      refresh_token: this.jwtService.sign(
        {
          id: user.uuid,
          tokenId: uuid(),
        },
        {
          secret: jwtConstants.refreshSecret,
          expiresIn: jwtConstants.refreshExpiresIn,
        },
      ),
    };
  }

  async signup(body: SingupDto) {
    if (body.password !== body.confirmPassword) {
      throw new BadRequestException('PASSWORDS_DO_NOT_MATCH');
    }

    const user = await this.userService.findByEmail(body.email);

    if (user) {
      throw new ConflictException('EMAIL_ALREADY_IN_USE');
    }

    if (body.password !== body.confirmPassword) {
      throw new BadRequestException('PASSWORDS_DO_NOT_MATCH');
    const newUser = plainToClass(CreateUserDto, body);
    await this.userService.createUser(newUser);

    return this.login(body.email, body.password);
    }

    const isTokenIdValid = await this.redisService.get(tokenId);

    if (!isTokenIdValid) {
      throw new UnauthorizedException('INVALID_REFRESH_TOKEN');
    }

    const expiresInSeconds = exp - Math.floor(Date.now() / 1000) + 1;
    await this.redisService.setex(tokenId, 'true', expiresInSeconds);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async refreshTokens(refreshToken: string) {
    const { id, tokenId }: RefreshTokenInterface =
      await this.jwtService.verifyAsync(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });

    const isTokenIdValid = await this.redisService.get(tokenId);
    if (!isTokenIdValid) {
      throw new UnauthorizedException('INVALID_REFRESH_TOKEN');
    }

    const user = await this.userService.findByUUID(id);

    if (!user) {
      throw new NotFoundException('USER_NOT_FOUND');
    }

    return {
      access_token: this.jwtService.sign({
        id: user.uuid,
      }),
      refresh_token: refreshToken,
    };
  }

  async getBlockedTokens() {
    return this.redisService.getAll();
  }
}
