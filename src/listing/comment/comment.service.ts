import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { ResourceContent } from '../../resource/types/resource.type';
import { plainToClass, plainToInstance } from 'class-transformer';
import { ResponseCommentDto } from './dto/response-comment-dto';
import { CommentSelect } from './selects/comment.select';
import { Status } from '@prisma/client';
import { Pagination } from '../../common/pagination';
import { PaginationResultDto } from '../../common/dtos/pagination.dto';

@Injectable()
export class CommentService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    userUuid: string,
    listingUuid: string,
    createCommentDto: CreateCommentDto,
  ): Promise<ResponseCommentDto> {
    const createdComment = await this.prisma.listingComment.create({
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
      select: CommentSelect,
    });

    return plainToClass(ResponseCommentDto, createdComment);
  }

  async findAll(
    uuid: string,
    pagination: Pagination,
  ): Promise<PaginationResultDto<ResponseCommentDto>> {
    const whereClause = {
      deleted_at: null,
      status: Status.PUBLIC,
      listing: {
        uuid,
      },
    };

    const totalCount = await this.prisma.listingComment.count({
      where: whereClause,
    });

    const comments = await this.prisma.listingComment.findMany({
      select: CommentSelect,
      where: whereClause,
      orderBy: {
        created_at: 'desc',
      },
      skip: pagination.page * pagination.limit - pagination.limit,
      take: pagination.limit,
    });

    return {
      data: plainToInstance(ResponseCommentDto, comments),
      ...pagination,
      totalCount,
    };
  }

  async findOne(uuid: string): Promise<ResponseCommentDto> {
    const comment = await this.prisma.listingComment.findUniqueOrThrow({
      where: {
        uuid,
        status: Status.PUBLIC,
        deleted_at: null,
      },
    });

    return plainToClass(ResponseCommentDto, comment);
  }

  async findOneMeta(uuid: string): Promise<ResourceContent | null> {
    const comment = await this.prisma.listingComment.findUnique({
      where: {
        uuid,
      },
      select: {
        uuid: true,
        user_uuid: true,
        status: true,
      },
    });

    if (!comment) return null;

    return {
      uuid: comment.uuid,
      ownerId: comment.user_uuid,
      status: 'PUBLIC',
    };
  }

  async update(uuid: string, updateCommentDto: UpdateCommentDto) {
    const updatedComment = await this.prisma.listingComment.update({
      where: {
        uuid,
      },
      data: {
        content: updateCommentDto.content,
        status: updateCommentDto.status ?? undefined,
      },
      select: CommentSelect,
    });

    return plainToClass(ResponseCommentDto, updatedComment);
  }

  async remove(uuid: string) {
    return this.prisma.listingComment.update({
      where: {
        uuid,
      },
      data: {
        status: Status.DELETED,
      },
      select: CommentSelect,
    });
  }
}
