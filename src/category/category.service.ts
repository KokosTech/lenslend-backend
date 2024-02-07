import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from '../prisma/prisma.service';
import { plainToClass, plainToInstance } from 'class-transformer';
import { Category } from './entities/category.entity';
import { ResponseCategoryDto } from './dto/response-category.dto';
import { ExpandedCategorySelect } from './selects/listing-category.select';
import { ExpandedPlaceCategorySelect } from './selects/place-category.select';
import { ResponseExpandedCategoryDto } from './dto/response-expanded-category.dto';
import { CategoryType } from './types/category.type';

// TODO: Remove infinite recursion

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    createCategoryDto: CreateCategoryDto,
    type: CategoryType,
  ): Promise<ResponseCategoryDto> {
    const category = plainToClass(Category, createCategoryDto);

    const result =
      type === 'LISTING'
        ? await this.prisma.category.create({
            data: {
              ...category,
            },
          })
        : await this.prisma.placeCategory.create({
            data: {
              ...category,
            },
          });

    return plainToClass(ResponseCategoryDto, result);
  }

  async findAll(type: CategoryType): Promise<ResponseExpandedCategoryDto[]> {
    const categories =
      type === 'LISTING'
        ? await this.prisma.category.findMany({
            select: ExpandedCategorySelect,
            where: {
              parent_uuid: null,
            },
            orderBy: {
              name: 'asc',
            },
          })
        : await this.prisma.placeCategory.findMany({
            select: ExpandedPlaceCategorySelect,
            where: {
              parent_uuid: null,
            },
            orderBy: {
              name: 'asc',
            },
          });

    // this is a workaround to avoid circular dependency
    return plainToInstance(ResponseExpandedCategoryDto, categories, {
      excludeExtraneousValues: true,
      enableCircularCheck: true,
    }) as unknown as ResponseExpandedCategoryDto[];
  }

  async findOne(
    uuid: string,
    type: CategoryType,
  ): Promise<ResponseExpandedCategoryDto> {
    const category =
      type === 'LISTING'
        ? await this.prisma.category.findUniqueOrThrow({
            select: ExpandedCategorySelect,
            where: {
              uuid,
            },
          })
        : await this.prisma.placeCategory.findUniqueOrThrow({
            select: ExpandedPlaceCategorySelect,
            where: {
              uuid,
            },
          });

    return plainToClass(ResponseExpandedCategoryDto, category);
  }

  async update(
    uuid: string,
    type: CategoryType,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<ResponseCategoryDto> {
    if (type === 'LISTING') {
      return this.prisma.category.update({
        where: {
          uuid,
        },
        data: updateCategoryDto,
      });
    } else {
      return this.prisma.placeCategory.update({
        where: {
          uuid,
        },
        data: updateCategoryDto,
      });
    }
  }

  private recursiveDelete = async (uuid: string) => {
    const uuidsToDelete: string[] = [];

    const subCategories = await this.prisma.category.findMany({
      where: {
        parent_uuid: uuid,
      },
    });

    if (subCategories.length > 0) {
      for (const subCategory of subCategories) {
        const uuids = await this.recursiveDelete(subCategory.uuid);
        uuidsToDelete.push(...uuids);
      }
    }

    uuidsToDelete.push(uuid);
    return uuidsToDelete;
  };

  async remove(uuid: string, type: CategoryType) {
    if (type === 'LISTING') {
      // delete all sub categories
      const uuidsToDelete = await this.recursiveDelete(uuid);

      return this.prisma.category.deleteMany({
        where: {
          OR: [
            {
              uuid,
            },
            {
              uuid: {
                in: uuidsToDelete,
              },
            },
          ],
        },
      });
    } else {
      const uuidsToDelete = await this.recursiveDelete(uuid);

      return this.prisma.placeCategory.deleteMany({
        where: {
          OR: [
            {
              uuid,
            },
            {
              uuid: {
                in: uuidsToDelete,
              },
            },
          ],
        },
      });
    }
  }
}
