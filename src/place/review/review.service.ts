import { Injectable } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { ResourceContent } from '../../resource/types/resource.type';
import { ResponseReviewDto } from './dto/response-review.dto';
import { plainToClass, plainToInstance } from 'class-transformer';
import { ReviewSelect } from './selects/review.select';
import { Status } from '@prisma/client';

@Injectable()
export class ReviewService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    userUuid: string,
    placeUuid: string,
    createReviewDto: CreateReviewDto,
  ): Promise<ResponseReviewDto> {
    const createdReview = await this.prisma.placeReview.create({
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
      select: ReviewSelect,
    });

    return plainToClass(ResponseReviewDto, createdReview);
  }

  async findAll(uuid: string): Promise<ResponseReviewDto[]> {
    const reviews = await this.prisma.placeReview.findMany({
      select: ReviewSelect,
      where: {
        deleted_at: null,
        status: Status.PUBLIC,
        place: {
          uuid,
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    return plainToInstance(ResponseReviewDto, reviews);
  }

  async findOne(uuid: string) {
    const review = await this.prisma.placeReview.findUniqueOrThrow({
      select: ReviewSelect,
      where: {
        uuid,
        status: Status.PUBLIC,
        deleted_at: null,
      },
    });

    return plainToClass(ResponseReviewDto, review);
  }

  async findOneUserReview(userUuid: string, placeUuid: string) {
    const review = await this.prisma.placeReview.findUniqueOrThrow({
      select: ReviewSelect,
      where: {
        placeUuid_userUuid: {
          userUuid,
          placeUuid,
        },
      },
    });

    return plainToClass(ResponseReviewDto, review);
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

  async update(
    uuid: string,
    updateReviewDto: UpdateReviewDto,
  ): Promise<ResponseReviewDto> {
    const updatedReview = await this.prisma.placeReview.update({
      where: {
        uuid,
      },
      data: {
        content: updateReviewDto.content ?? undefined,
        rating: updateReviewDto.rating,
        status: updateReviewDto.status ?? undefined,
      },
      select: ReviewSelect,
    });

    return plainToClass(ResponseReviewDto, updatedReview);
  }

  async remove(uuid: string) {
    return this.prisma.placeReview.update({
      where: {
        uuid,
      },
      data: {
        status: Status.DELETED,
        deleted_at: new Date(),
      },
    });
  }
}
