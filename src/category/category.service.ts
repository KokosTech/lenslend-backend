import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from '../prisma/prisma.service';

// TODO: Remove infinite recursion

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  async create({ name, parent_uuid, type }: CreateCategoryDto) {
    if (type === 'LISTING') {
      return this.prisma.category.create({
        data: {
          name,
          parent_uuid,
        },
      });
    } else {
      return this.prisma.placeCategory.create({
        data: {
          name,
          parent_uuid,
        },
      });
    }
  }

  async findAll(type: 'LISTING' | 'PLACE') {
    if (type === 'LISTING') {
      return this.prisma.category.findMany({
        where: {
          parent_uuid: null,
        },
        orderBy: {
          name: 'asc',
        },
        include: {
          sub_categories: {
            orderBy: {
              name: 'asc',
            },
            include: {
              sub_categories: {
                orderBy: {
                  name: 'asc',
                },
              },
            },
          },
        },
      });
    } else {
      return this.prisma.placeCategory.findMany({
        where: {
          parent_uuid: null,
        },
        orderBy: {
          name: 'asc',
        },
        include: {
          sub_categories: {
            orderBy: {
              name: 'asc',
            },
            include: {
              sub_categories: {
                orderBy: {
                  name: 'asc',
                },
              },
            },
          },
        },
      });
    }
  }

  async findOne(uuid: string, type: 'LISTING' | 'PLACE') {
    if (type === 'LISTING') {
      return this.prisma.category.findUniqueOrThrow({
        where: {
          uuid,
        },
        include: {
          sub_categories: {
            orderBy: {
              name: 'asc',
            },
            include: {
              sub_categories: {
                orderBy: {
                  name: 'asc',
                },
              },
            },
          },
        },
      });
    } else {
      return this.prisma.placeCategory.findUniqueOrThrow({
        where: {
          uuid,
        },
        include: {
          sub_categories: {
            orderBy: {
              name: 'asc',
            },
            include: {
              sub_categories: {
                orderBy: {
                  name: 'asc',
                },
              },
            },
          },
        },
      });
    }
  }

  async update(
    uuid: string,
    type: 'LISTING' | 'PLACE',
    updateCategoryDto: UpdateCategoryDto,
  ) {
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

  async remove(uuid: string, type: 'LISTING' | 'PLACE') {
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
