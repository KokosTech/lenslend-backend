import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';
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

  async findByUUID(uuid: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: {
        uuid,
      },
    });
  }

  async createUser(user: CreateUserDto): Promise<User> {
    user.password = await hash(user.password, roundsOfHashing);

    return this.prisma.user.create({
      data: user,
    });
  }
}
