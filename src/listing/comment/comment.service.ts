import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CommentService {
  constructor(private readonly prisma: PrismaService) {}

  create(createCommentDto: CreateCommentDto) {
    return 'This action adds a new comment';
  }

  findAll(uuid: string) {
    return this.prisma.listingComment.findMany({
      select: {
        uuid: true,
        content: true,
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
        listing: {
          uuid,
        },
      },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} comment`;
  }

  update(id: number, updateCommentDto: UpdateCommentDto) {
    return `This action updates a #${id} comment`;
  }

  remove(id: number) {
    return `This action removes a #${id} comment`;
  }
}
