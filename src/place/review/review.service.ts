import { Injectable } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { PrismaService } from '../../prisma/prisma.service';

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

  findOne(id: number) {
    return `This action returns a #${id} review`;
  }

  update(id: number, updateReviewDto: UpdateReviewDto) {
    return `This action updates a #${id} review`;
  }

  remove(id: number) {
    return `This action removes a #${id} review`;
  }
}
