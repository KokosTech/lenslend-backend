import { Injectable } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { ResourceContent } from '../../resource/resource.type';

@Injectable()
export class ReviewService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    userUuid: string,
    placeUuid: string,
    createReviewDto: CreateReviewDto,
  ) {
    return this.prisma.placeReview.create({
      data: {
        content: createReviewDto.content ?? null,
        rating: createReviewDto.rating,
        user: {
          connect: {
            uuid: userUuid,
          },
        },
        place: {
          connect: {
            uuid: placeUuid,
          },
        },
      },
    });
  }

  findAll(uuid: string) {
    return this.prisma.placeReview.findMany({
      select: {
        uuid: true,
        content: true,
        rating: true,
        created_at: true,
        updated_at: true,
        user: {
          select: {
            uuid: true,
            name: true,
            username: true,
            profile_pic: true,
          },
        },
      },
      where: {
        place: {
          uuid,
        },
      },
    });
  }

  async findOne(uuid: string) {
    return this.prisma.placeReview.findUnique({
      where: {
        uuid,
      },
    });
  }

  async findOneUserReview(userUuid: string, placeUuid: string) {
    return this.prisma.placeReview.findUniqueOrThrow({
      select: {
        uuid: true,
        content: true,
        rating: true,
        created_at: true,
        updated_at: true,
        user: {
          select: {
            uuid: true,
            name: true,
            username: true,
            profile_pic: true,
          },
        },
      },
      where: {
        placeUuid_userUuid: {
          userUuid,
          placeUuid,
        },
      },
    });
  }

  async findOneMeta(uuid: string): Promise<ResourceContent | null> {
    const review = await this.prisma.placeReview.findUnique({
      where: {
        uuid,
      },
      select: {
        uuid: true,
        status: true,
        userUuid: true,
      },
    });

    if (!review) return null;

    return {
      uuid: review.uuid,
      ownerId: review.userUuid,
      status: review.status,
    };
  }

  update(id: number, updateReviewDto: UpdateReviewDto) {
    return `This action updates a #${id} review`;
  }

  remove(id: number) {
    return `This action removes a #${id} review`;
  }
}
