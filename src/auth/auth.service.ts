import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { compare } from 'bcrypt';

import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { SingupDto } from './dtos/singup.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<unknown> {
    const user = await this.userService.findByEmail(email);

    if (user && (await compare(pass, user.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }

    return null;
  }

  async login(email: string, password: string) {
    const user = await this.userService.findByEmail(email);

    if (!user) {
      throw new NotFoundException('NO_USER_FOUND');
    }

    const isPasswordValid = await compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('INVALID_PASSWORD');
    }

    return {
      access_token: this.jwtService.sign({
        id: user.uuid,
      }),
    };
  }

  async signup(body: SingupDto) {
    const user = await this.userService.findByEmail(body.email);

    if (user) {
      throw new ConflictException('EMAIL_ALREADY_IN_USE');
    }

    if (body.password !== body.confirmPassword) {
      throw new BadRequestException('PASSWORDS_DO_NOT_MATCH');
    }

    return this.userService.createUser(body);
  }
}
