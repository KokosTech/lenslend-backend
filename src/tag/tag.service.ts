import { Injectable } from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { PrismaService } from '../prisma/prisma.service';
import { plainToClass, plainToInstance } from 'class-transformer';
import { ResponseTagDto } from './dto/response-tag.dto';

@Injectable()
export class TagService {
  constructor(private readonly prisma: PrismaService) {}

  async createOrFind(createTagDto: CreateTagDto): Promise<ResponseTagDto> {
    const foundTag = await this.prisma.tag.findUnique({
      where: {
        name: createTagDto.name,
      },
    });

    if (!foundTag) {
      const newTag = await this.prisma.tag.create({
        data: {
          name: createTagDto.name,
        },
      });

      return plainToClass(ResponseTagDto, newTag);
    }

    return plainToClass(ResponseTagDto, foundTag);
  }

  async findAll(): Promise<ResponseTagDto[]> {
    const tags = await this.prisma.tag.findMany();
    return plainToInstance(ResponseTagDto, tags);
  }

  async findOne(name: string) {
    const tag = await this.prisma.tag.findUnique({
      where: {
        name,
      },
    });

    return plainToClass(ResponseTagDto, tag);
  }
}
