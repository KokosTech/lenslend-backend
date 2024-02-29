import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { User } from '@prisma/client';
import { CreateUserDto } from './dtos/create-user.dto';
import { hash } from 'bcrypt';
import {
  ResponseProfileDto,
  ResponsePublicProfileDto,
} from './dtos/response-user.dto';
import { plainToClass, plainToInstance } from 'class-transformer';
import { RateUserDto } from './dtos/rate-user.dto';
import { roundRating } from '../common/utils/roundRating';
import { Pagination } from '../common/pagination';
import { PaginationResultDto } from '../common/dtos/pagination.dto';

export const roundsOfHashing = 10;

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findAll(
    pagination: Pagination,
  ): Promise<PaginationResultDto<ResponseProfileDto>> {
    const totalCount = await this.prisma.user.count();
    const users = await this.prisma.user.findMany({
      orderBy: {
        created_at: 'desc',
      },
      skip: pagination.page * pagination.limit - pagination.limit,
      take: pagination.limit,
    });
    return {
      data: plainToInstance(ResponseProfileDto, users),
      ...pagination,
      totalCount,
    };
  }

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

  async getUserRating(uuid: string | undefined): Promise<number> {
    if (!uuid) return 0;

    const userRating = await this.prisma.userRating.groupBy({
      by: ['user_rated_uuid'],
      _avg: {
        rating: true,
      },
      where: {
        user_rated_uuid: uuid,
      },
    });

    return userRating[0] ? roundRating(userRating[0]._avg.rating) : 0;
  }

  async getUserProfile(uuid: string): Promise<ResponseProfileDto> {
    const user = await this.prisma.user.findUniqueOrThrow({
      where: {
        uuid,
      },
    });

    const userRating = await this.getUserRating(uuid);

    return plainToInstance(ResponseProfileDto, {
      ...user,
      rating: userRating,
    });
  }

  async getPublicProfile(username: string): Promise<ResponsePublicProfileDto> {
    const user = await this.findByUsername(username);

    if (!user) {
      throw new NotFoundException('USER_NOT_FOUND');
    }

    const userRating = await this.getUserRating(user.uuid);

    return plainToClass(ResponsePublicProfileDto, {
      ...user,
      rating: userRating,
    });
  }

  async getPublicProfiles(
    pagination: Pagination,
  ): Promise<PaginationResultDto<ResponsePublicProfileDto>> {
    const whereClause = {
      deleted_at: null,
    };

    const totalCount = await this.prisma.user.count({
      where: whereClause,
    });

    const users = await this.prisma.user.findMany({
      where: whereClause,
      orderBy: {
        created_at: 'desc',
      },
      skip: pagination.page * pagination.limit - pagination.limit,
      take: pagination.limit,
    });

    const userRatings = await this.prisma.userRating.groupBy({
      by: ['user_rated_uuid'],
      _avg: {
        rating: true,
      },
      where: {
        user_uuid: { in: users.map((user) => user.uuid) },
        deleted_at: null,
      },
    });

    const ratingsMap = new Map(
      userRatings.map((r) => [r.user_rated_uuid, r._avg.rating]),
    );

    const result = users.map((user) => {
      const averageRating = ratingsMap.get(user.uuid) || 0;
      return {
        ...user,
        rating: roundRating(averageRating),
      };
    });

    return {
      data: plainToInstance(ResponsePublicProfileDto, result),
      ...pagination,
      totalCount,
    };
  }

  async rate(
    srcUuid: string,
    targetUsername: string,
    rateUserDto: RateUserDto,
  ): Promise<RateUserDto> {
    const targetUser = await this.findByUsername(targetUsername);

    if (!targetUser) {
      throw new NotFoundException('USER_NOT_FOUND');
    }

    if (srcUuid === targetUser.uuid) {
      throw new ConflictException('CANNOT_RATE_SELF');
    }

    const rating = await this.prisma.userRating.upsert({
      where: {
        user_uuid_user_rated_uuid: {
          user_uuid: srcUuid,
          user_rated_uuid: targetUser.uuid,
        },
      },
      update: {
        rating: rateUserDto.rating,
      },
      create: {
        rating: rateUserDto.rating,
        user: {
          connect: {
            uuid: srcUuid,
          },
        },
        user_rated: {
          connect: {
            uuid: targetUser.uuid,
          },
        },
      },
      select: {
        rating: true,
      },
    });

    return plainToClass(RateUserDto, rating);
  }

  async getRate(srcUuid: string, targetUsername: string): Promise<RateUserDto> {
    const targetUser = await this.findByUsername(targetUsername);

    if (!targetUser) {
      throw new NotFoundException('USER_NOT_FOUND');
    }

    const rating = await this.prisma.userRating.findUnique({
      where: {
        user_uuid_user_rated_uuid: {
          user_uuid: srcUuid,
          user_rated_uuid: targetUser.uuid,
        },
      },
      select: {
        rating: true,
      },
    });

    return plainToClass(RateUserDto, rating);
  }
}
