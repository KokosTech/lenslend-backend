import { Injectable } from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TagService {
  constructor(private readonly prisma: PrismaService) {}

  async createOrFind(createTagDto: CreateTagDto) {
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

      return newTag.uuid;
    }

    return foundTag.uuid;
  }

  findAll() {
    return 'This action returns all tag';
  }

  findOne(name: string) {
    return this.prisma.tag.findUnique({
      where: {
        name,
      },
    });
  }

  update(id: number, updateTagDto: UpdateTagDto) {
    return `This action updates a #${id} tag`;
  }

  remove(id: number) {
    return `This action removes a #${id} tag`;
  }
}
