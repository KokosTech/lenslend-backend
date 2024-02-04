import { Injectable } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { Status } from '@prisma/client';

@Injectable()
export class ReviewService {
  constructor(private readonly prisma: PrismaService) {}

  create(createReviewDto: CreateReviewDto) {
    return 'This action adds a new review';
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

  findOne(uuid: string) {
    return this.prisma.placeReview.findUnique({
      where: {
        uuid,
      },
    });
  }

  async findOneMeta(uuid: string): Promise<{
    ownerId: string;
    status: Status;
  } | null> {
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
