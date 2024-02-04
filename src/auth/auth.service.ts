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
import { SignupDto, SignupOneDto } from './dtos/signupDto';
import { CreateUserDto } from '../user/dtos/create-user.dto';
import { RefreshTokenInterface } from './interfaces/refreshToken.interface';
import { User } from '@prisma/client';
import { AuthTokenInterface } from './interfaces/authToken.interface';

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

    console.warn('user', user);

    if (!user) {
      throw new NotFoundException('NO_USER_FOUND');
    }

    if (!(await compare(password, user.password))) {
      console.warn('THROWING UNAUTHORIZED EXCEPTION');
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

  async validateSignup(body: SignupDto | SignupOneDto, step: number) {
    if (step === 1) {
      if (body.password !== body.confirmPassword) {
        throw new BadRequestException({
          message: 'passwordConfirm',
          code: 'PASSWORDS_DO_NOT_MATCH',
        });
      }

      const email = await this.userService.findByEmail(body.email);

      if (email) {
        throw new ConflictException({
          message: 'email',
          code: 'EMAIL_ALREADY_IN_USE',
        });
      }

      const username = await this.userService.findByUsername(body.username);

      if (username) {
        throw new ConflictException({
          message: 'username',
          code: 'USERNAME_ALREADY_IN_USE',
        });
      }
    } else if (step === 2 && body instanceof SignupDto) {
      const phone = await this.userService.findByPhone(body.phone);

      if (phone) {
        throw new ConflictException({
          message: 'phone',
          code: 'PHONE_ALREADY_IN_USE',
        });
      }
    }
  }

  async signup(body: SignupDto) {
    await this.validateSignup(body, 2);

    const newUser = plainToClass(CreateUserDto, body);
    newUser.name = `${body.firstName} ${body.lastName}`;
    newUser.date_of_birth = new Date(body.dateOfBirth).toISOString();

    await this.userService.createUser(newUser);

    return this.login(body.email, body.password);
  }

  async logout(accessToken: string, refreshToken: string) {
    const { id, tokenId, exp }: RefreshTokenInterface =
      await this.jwtService.verifyAsync(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });

    const user = await this.userService.findByUUID(id);

    if (!user) {
      throw new NotFoundException('USER_NOT_FOUND');
    }

    const isTokenIdInvalid = await this.redisService.get(tokenId);

    if (isTokenIdInvalid) {
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

  async getUserFromToken(token: string | null): Promise<User | null> {
    if (!token) {
      return null;
    }

    try {
      const { id }: AuthTokenInterface = await this.jwtService.verifyAsync(
        token,
        {
          secret: jwtConstants.secret,
        },
      );

      return this.userService.findByUUID(id);
    } catch {
      return null;
    }
  }
}
