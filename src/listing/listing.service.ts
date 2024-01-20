import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateListingDto } from './dto/create-listing.dto';
import { UpdateListingDto } from './dto/update-listing.dto';
import { PrismaService } from '../prisma/prisma.service';
import { UserService } from '../user/user.service';
import { ListingSelect, ShortListingSelect } from './listing.select';
import { User } from '@prisma/client';
import { plainToClass } from 'class-transformer';
import { Listing } from './entities/listing.entity';

@Injectable()
export class ListingService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
  ) {}

  async create(user: User, createListingDto: CreateListingDto) {
    const { uuid } = user;
    const { categoryId, tags, images } = createListingDto;

    if (
      await this.prisma.category.findUnique({
        where: {
          uuid: categoryId,
        },
      })
    ) {
      throw new BadRequestException('CATEGORY_NOT_FOUND');
    }

    const tagIds = await Promise.all(
      tags.map(async (tag) => {
        const foundTag = await this.prisma.tag.findUnique({
          where: {
            uuid: tag,
          },
        });

        if (!foundTag) {
          const newTag = await this.prisma.tag.create({
            data: {
              name: tag,
            },
          });

          return newTag.uuid;
        }

        return foundTag.uuid;
      }),
    );

    const listingEntity = plainToClass(Listing, createListingDto);

    const listing = await this.prisma.listing.create({
      data: {
        title: listingEntity.title,
        description: listingEntity.description,
        // lat: listingEntity.lat,
        // lng: listingEntity.lng,
        type: listingEntity.type,
        price: listingEntity.price,
        state: listingEntity.state,
        rental: listingEntity.rental,
        negotiable: listingEntity.negotiable,
        status: listingEntity.status,
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
      },
    });

    await Promise.all(
      images.map(async (image, i) => {
        const newImage = await this.prisma.listingImage.create({
          data: {
            url: image,
            alt: 'Listing Image',
            order: i,
            listing: {
              connect: {
                uuid: listing.uuid,
              },
            },
          },
        });

        return newImage.uuid;
      }),
    );

    await this.prisma.listingTag.createMany({
      data: tagIds.map((tagId) => ({
        listing_uuid: listing.uuid,
        tag_uuid: tagId,
      })),
    });

    return this.prisma.listing.findUnique({
      where: {
        uuid: listing.uuid,
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
