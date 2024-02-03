import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateListingDto } from './dto/create-listing.dto';
import { UpdateListingDto } from './dto/update-listing.dto';
import { PrismaService } from '../prisma/prisma.service';
import { ListingSelect, ShortListingSelect } from './listing.select';
import { Status, User } from '@prisma/client';
import { plainToClass } from 'class-transformer';
import { Listing } from './entities/listing.entity';
import { TagService } from '../tag/tag.service';

@Injectable()
export class ListingService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tagService: TagService,
  ) {}

  async create(user: User, createListingDto: CreateListingDto) {
    const { uuid } = user;
    const { categoryId, tags, images } = createListingDto;

    const category = await this.prisma.category.findUnique({
      where: {
        uuid: categoryId,
      },
    });

    if (!category) {
      throw new BadRequestException('CATEGORY_NOT_FOUND');
    }

    const listingEntity = plainToClass(Listing, createListingDto);

    return this.prisma.listing.create({
      data: {
        ...listingEntity,
        user: {
          connect: {
            uuid,
          },
        },
        category: {
          connect: {
            uuid: categoryId,
          },
        },
        images: {
          create: images.map((image, i) => ({
            url: image,
            alt: image,
            order: i,
          })),
        },
        tags: {
          create: tags.map((tag) => ({
            tag: {
              connectOrCreate: {
                where: {
                  name: tag,
                },
                create: {
                  name: tag,
                },
              },
            },
          })),
        },
      },
      select: ListingSelect,
    });
  }

  async findAll() {
    return this.prisma.listing.findMany({
      select: ShortListingSelect,
      orderBy: {
        created_at: 'desc',
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.listing.findUniqueOrThrow({
      where: {
        uuid: id,
      },
      select: ListingSelect,
    });
  }

  async getListingsByUsername(username: string, status?: Status) {
    return this.prisma.listing.findMany({
      where: {
        user: {
          username,
        },
        status,
      },
      select: ShortListingSelect,
      orderBy: {
        created_at: 'desc',
      },
    });
  }

  async update(id: string, user: User, updateListingDto: UpdateListingDto) {
    const { uuid } = user;
    const { categoryId, tags, images } = updateListingDto;

    const category = await this.prisma.category.findUnique({
      where: {
        uuid: categoryId,
      },
    });

    if (!category) {
      throw new BadRequestException('CATEGORY_NOT_FOUND');
    }

    const listingEntity = plainToClass(Listing, updateListingDto);

    return this.prisma.listing.update({
      where: {
        uuid: id,
      },
      data: {
        ...listingEntity,
        user: {
          connect: {
            uuid,
          },
        },
        category: {
          connect: {
            uuid: categoryId,
          },
        },
        images: {
          create: images?.map((image, i) => ({
            url: image,
            alt: image,
            order: i,
          })),
        },
        tags: {
          create: tags?.map((tag) => ({
            tag: {
              connectOrCreate: {
                where: {
                  name: tag,
                },
                create: {
                  name: tag,
                },
              },
            },
          })),
        },
      },
      select: ListingSelect,
    });
  }

  async remove(id: string) {
    return this.prisma.listing.delete({
      where: {
        uuid: id,
      },
    });
  }
}
