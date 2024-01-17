import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CommentService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    userUuid: string,
    listingUuid: string,
    createCommentDto: CreateCommentDto,
  ) {
    // get user from jwt guard

    return this.prisma.listingComment.create({
      data: {
        content: createCommentDto.content,
        user: {
          connect: {
            uuid: userUuid,
          },
        },
        listing: {
          connect: {
            uuid: listingUuid,
          },
        },
      },
    });
  }

  async findAll(uuid: string) {
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
      orderBy: {
        created_at: 'desc',
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
