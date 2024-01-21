import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateListingDto } from './dto/create-listing.dto';
import { UpdateListingDto } from './dto/update-listing.dto';
import { PrismaService } from '../prisma/prisma.service';
import { ListingSelect, ShortListingSelect } from './listing.select';
import { User } from '@prisma/client';
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

    return await this.prisma.listing.create({
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
    const listing = await this.prisma.listing.findUnique({
      where: {
        uuid: id,
      },
      select: ListingSelect,
    });

    if (!listing) {
      throw new NotFoundException('LISTING_NOT_FOUND');
    }

    return listing;
  }

  async update(id: number, updateListingDto: UpdateListingDto) {
    return `This action updates a #${id} listing`;
  }

  async remove(id: number) {
    return `This action removes a #${id} listing`;
  }
}
