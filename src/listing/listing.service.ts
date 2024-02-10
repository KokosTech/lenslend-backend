import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateListingDto } from './dto/create-listing.dto';
import { UpdateListingDto } from './dto/update-listing.dto';
import { PrismaService } from '../prisma/prisma.service';
import { ListingSelect } from './selects/listing.select';
import { Status, User } from '@prisma/client';
import { plainToClass, plainToInstance } from 'class-transformer';
import { Listing } from './entities/listing.entity';
import { ResourceContent } from '../resource/types/resource.type';
import { ResponseShortListingDto } from './dto/response-short-listing.dto';
import { ResponseListingDto } from './dto/response-listing.dto';
import { RateListingDto } from './dto/rate-listing.dto';
import { ResponseSavedDto } from './dto/response-saved.dto';
import { ShortListingSelect } from './selects/short-listing.select';
import { UserService } from '../user/user.service';
import { Pagination } from '../common/pagination';
import { PaginationResultDto } from '../common/dtos/pagination.dto';
import { commonWhereClause } from '../common/common.where';
import { CategoryService } from '../category/category.service';

@Injectable()
export class ListingService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
    private readonly categoryService: CategoryService,
  ) {}

  async create(
    user: User,
    createListingDto: CreateListingDto,
  ): Promise<ResponseListingDto> {
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

    const createdListing = await this.prisma.listing.create({
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
            order: i + 1,
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

    return plainToInstance(ResponseListingDto, createdListing);
  }

  async findAll(
    paginate: Pagination,
    category?: string,
  ): Promise<PaginationResultDto<ResponseShortListingDto>> {
    const categories = category
      ? await this.categoryService.findOneAndSubCategoriesUuids(
          category,
          'LISTING',
        )
      : null;

    console.log('========= category =========');
    console.log('categories', categories);

    const whereClause =
      category && categories
        ? {
            status: Status.PUBLIC,
            deleted_at: null,
            user: {
              deleted_at: null,
            },
            category: { uuid: { in: categories } },
          }
        : commonWhereClause;

    const totalCount = await this.prisma.listing.count({
      where: whereClause,
    });

    const listings = await this.prisma.listing.findMany({
      select: ShortListingSelect,
      where: whereClause,
      orderBy: {
        created_at: 'desc',
      },
      skip: paginate.page * paginate.limit - paginate.limit,
      take: paginate.limit,
    });

    const result = listings.map((listing) => {
      const [thumbnail] = listing.images;
      return {
        ...listing,
        thumbnail,
      };
    });

    return {
      data: plainToInstance(ResponseShortListingDto, result),
      page: paginate.page,
      limit: paginate.limit,
      totalCount,
    };
  }

  async findOne(uuid: string): Promise<ResponseListingDto> {
    const listing = await this.prisma.listing.findUniqueOrThrow({
      where: {
        uuid,
        deleted_at: null,
        user: {
          deleted_at: null,
        },
      },
      select: ListingSelect,
    });

    const userRating = await this.userService.getUserRating(listing.user_uuid);

    return plainToInstance(ResponseListingDto, {
      ...listing,
      rating: userRating,
    });
  }

  async findOneMeta(id: string): Promise<ResourceContent | null> {
    const listingMeta = await this.prisma.listing.findUnique({
      where: {
        uuid: id,
      },
      select: {
        uuid: true,
        status: true,
        user_uuid: true,
      },
    });

    if (!listingMeta) return null;

    return {
      uuid: listingMeta.uuid,
      ownerId: listingMeta.user_uuid,
      status: listingMeta.status,
    };
  }

  async findByUsername(
    paginate: Pagination,
    username: string,
    status?: Status,
  ): Promise<PaginationResultDto<ResponseShortListingDto>> {
    const whereClause = {
      user: {
        username,
      },
      status,
    };

    const totalCount = await this.prisma.listing.count({
      where: whereClause,
    });

    const listings = await this.prisma.listing.findMany({
      where: whereClause,
      select: ShortListingSelect,
      orderBy: {
        created_at: 'desc',
      },
      skip: paginate.page * paginate.limit - paginate.limit,
      take: paginate.limit,
    });

    const result = listings.map((listing) => {
      const [thumbnail] = listing.images;
      return {
        ...listing,
        thumbnail,
      };
    });

    return {
      data: plainToInstance(ResponseShortListingDto, result),
      page: 1,
      limit: 10,
      totalCount,
    };
  }

  async rate(
    uuid: string,
    userUuid: string,
    rateListingDto: RateListingDto,
  ): Promise<RateListingDto> {
    const rating = await this.prisma.listingRating.upsert({
      where: {
        user_uuid_listing_uuid: {
          user_uuid: userUuid,
          listing_uuid: uuid,
        },
      },
      update: {
        rating: rateListingDto.rating,
      },
      create: {
        rating: rateListingDto.rating,
        user: {
          connect: {
            uuid: userUuid,
          },
        },
        listing: {
          connect: {
            uuid,
          },
        },
      },
      select: {
        rating: true,
      },
    });

    return plainToInstance(RateListingDto, rating);
  }

  async save(uuid: string, userUuid: string): Promise<ResponseSavedDto> {
    const existingSave = await this.prisma.userSavedListings.findUnique({
      where: {
        user_uuid_listing_uuid: {
          user_uuid: userUuid,
          listing_uuid: uuid,
        },
      },
    });

    if (existingSave) {
      const saved = await this.prisma.userSavedListings.update({
        where: {
          user_uuid_listing_uuid: {
            user_uuid: userUuid,
            listing_uuid: uuid,
          },
        },
        data: {
          deleted_at: existingSave.deleted_at ? null : new Date(),
        },
        select: {
          deleted_at: true,
        },
      });

      return {
        saved: !saved.deleted_at,
      };
    }

    await this.prisma.userSavedListings.create({
      data: {
        user: {
          connect: {
            uuid: userUuid,
          },
        },
        listing: {
          connect: {
            uuid,
          },
        },
      },
    });

    return {
      saved: true,
    };
  }

  async update(
    uuid: string,
    userUuid: string,
    updateListingDto: UpdateListingDto,
  ): Promise<ResponseListingDto> {
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

    const updatedListing = this.prisma.listing.update({
      where: {
        uuid,
      },
      data: {
        ...listingEntity,
        category: {
          connect: {
            uuid: categoryId,
          },
        },
        images: {
          create: images.map((image, i) => ({
            url: image,
            alt: image,
            order: i + 1,
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

    return plainToInstance(ResponseListingDto, updatedListing);
  }

  async remove(uuid: string) {
    return this.prisma.listing.update({
      where: {
        uuid,
      },
      data: {
        status: 'DELETED',
        deleted_at: new Date(),
      },
    });
  }
}
