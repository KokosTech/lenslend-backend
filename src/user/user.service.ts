import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { User } from '@prisma/client';
import { CreateUserDto } from './dtos/create-user.dto';
import { hash } from 'bcrypt';

export const roundsOfHashing = 10;

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: {
        username,
      },
    });
  }

  async findByPhone(phone: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: {
        phone,
      },
    });
  }

  async findByUUID(uuid: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: {
        uuid,
      },
    });
  }

  async createUser(user: CreateUserDto): Promise<User> {
    const userInUse = await this.prisma.user.findMany({
      where: {
        OR: [
          {
            email: user.email,
          },
          {
            username: user.username,
          },
          {
            phone: user.phone,
          },
        ],
      },
    });

    if (userInUse.length > 0) {
      userInUse.map((existingUser) => {
        if (existingUser.email === user.email) {
          throw new ConflictException('EMAIL_IN_USE');
        }

        if (existingUser.username === user.username) {
          throw new ConflictException('USERNAME_IN_USE');
        }

        if (existingUser.phone === user.phone) {
          throw new ConflictException('PHONE_IN_USE');
        }
      });
    }

    user.password = await hash(user.password, roundsOfHashing);

    return this.prisma.user.create({
      data: user,
    });
  }
}
