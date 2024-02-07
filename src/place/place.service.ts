import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePlaceDto } from './dto/create-place.dto';
import { PrismaService } from '../prisma/prisma.service';
import { PlaceSelect } from './selects/place.select';
import { ResourceContent } from '../resource/types/resource.type';
import { plainToClass, plainToInstance } from 'class-transformer';
import { User } from '@prisma/client';
import { Place } from './entities/place.entity';
import { ResponsePlaceDto } from './dto/response-place.dto';
import { CardPlaceSelect } from './selects/card-place.select';
import { ResponseCardPlaceDto } from './dto/response-card-place.dto';
import { ResponseShortPlaceDto } from './dto/response-short-place.dto';
import { ShortPlaceSelect } from './selects/short-place.select';
import { roundRating } from '../common/utils/roundRating';
import { UpdatePlaceDto } from './dto/update-place.dto';
import { ResponseHereDto } from './dto/response-here.dto';
import { ResponseSavedDto } from '../listing/dto/response-saved.dto';
import { UserService } from '../user/user.service';
import { VisitorDto } from '../common/types/visitor';

@Injectable()
export class PlaceService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
  ) {}

  async create(
    user: User,
    createPlaceDto: CreatePlaceDto,
  ): Promise<ResponsePlaceDto> {
    const { uuid } = user;
    const { categoryUuid, tags, images, services } = createPlaceDto;

    const category = await this.prisma.placeCategory.findUnique({
      where: {
        uuid: categoryUuid,
      },
    });

    if (!category) {
      throw new BadRequestException('CATEGORY_NOT_FOUND');
    }

    const placeEntity = plainToClass(Place, createPlaceDto);

    const createdPlace = this.prisma.place.create({
      data: {
        ...placeEntity,
        creator: {
          connect: {
            uuid,
          },
        },
        category: {
          connect: {
            uuid: categoryUuid,
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
        services: {
          create: services.map((service) => ({
            service: {
              connect: {
                uuid: service,
              },
            },
          })),
        },
      },
      select: PlaceSelect,
    });

    return plainToClass(ResponsePlaceDto, createdPlace);
  }

  async findAll(
    format?: 'short' | 'card',
  ): Promise<ResponseCardPlaceDto[] | ResponseShortPlaceDto[]> {
    const places = await this.prisma.place.findMany({
      select: format === 'short' ? ShortPlaceSelect : CardPlaceSelect,
      where: {
        status: 'PUBLIC',
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    if (format === 'short') {
      return plainToInstance(ResponseShortPlaceDto, places);
    }

    const ratings = await this.prisma.placeReview.groupBy({
      by: ['placeUuid'],
      _avg: {
        rating: true,
      },
      where: {
        placeUuid: { in: places.map((place) => place.uuid) },
      },
    });

    const ratingsMap = new Map(
      ratings.map((r) => [r.placeUuid, r._avg.rating]),
    );

    const result = places.map((place) => {
      const averageRating = ratingsMap.get(place.uuid) || 0;
      const [thumbnail] = place.images;

      return {
        ...place,
        thumbnail,
        rating: roundRating(averageRating),
      };
    });

    return plainToInstance(ResponseCardPlaceDto, result);
  }

  async findOne(uuid: string): Promise<ResponsePlaceDto> {
    const place = await this.prisma.place.findUniqueOrThrow({
      where: {
        uuid,
      },
      select: PlaceSelect,
    });

    const averageRating = await this.prisma.placeReview.aggregate({
      where: {
        placeUuid: uuid,
      },
      _avg: {
        rating: true,
      },
    });

    // get creator user rating, owner user rating and visitors user rating
    const creatorRating = await this.userService.getUserRating(
      place.creator.uuid,
    );
    const ownerRating = await this.userService.getUserRating(place.owner?.uuid);

    const visitorsRatingsPromise = place.visitors.map(async (visitor) => {
      const newVisitor = plainToInstance(VisitorDto, visitor);
      console.log('newVisitor', newVisitor);
      return this.userService.getUserRating(newVisitor.user.uuid);
    });
    const visitorRatings = await Promise.all(visitorsRatingsPromise);

    console.log('vis', visitorRatings);

    return plainToClass(ResponsePlaceDto, {
      ...place,
      creator: {
        ...place.creator,
        rating: roundRating(creatorRating),
      },
      owner: {
        ...place.owner,
        rating: roundRating(ownerRating),
      },
      visitors: place.visitors.map((visitor, i) => ({
        ...visitor,
        rating: roundRating(visitorRatings[i]),
      })),
      rating: roundRating(averageRating._avg.rating),
    });
  }

  async findOneMeta(uuid: string): Promise<ResourceContent | null> {
    const place = await this.prisma.place.findUnique({
      where: {
        uuid,
      },
      select: {
        uuid: true,
        status: true,
        creatorUuid: true,
      },
    });

    if (!place) return null;

    return {
      uuid: place.uuid,
      ownerId: place.creatorUuid,
      status: place.status,
    };
  }

  async save(uuid: string, userUuid: string): Promise<ResponseSavedDto> {
    const existingSaved = await this.prisma.userSavedPlaces.findUnique({
      where: {
        user_uuid_place_uuid: {
          place_uuid: uuid,
          user_uuid: userUuid,
        },
      },
    });

    const res = await this.prisma.userSavedPlaces.upsert({
      where: {
        user_uuid_place_uuid: {
          place_uuid: uuid,
          user_uuid: userUuid,
        },
      },
      create: {
        user: {
          connect: {
            uuid: userUuid,
          },
        },
        place: {
          connect: {
            uuid,
          },
        },
      },
      update: {
        deleted_at: existingSaved?.deleted_at ? null : new Date(),
      },
      select: {
        deleted_at: true,
      },
    });

    return {
      saved: !res.deleted_at,
    };
  }

  async here(uuid: string, userUuid: string): Promise<ResponseHereDto> {
    const existingHere = await this.prisma.placeVisitor.findUnique({
      where: {
        placeUuid_userUuid: {
          placeUuid: uuid,
          userUuid,
        },
      },
    });

    const res = await this.prisma.placeVisitor.upsert({
      where: {
        placeUuid_userUuid: {
          placeUuid: uuid,
          userUuid,
        },
      },
      create: {
        user: {
          connect: {
            uuid: userUuid,
          },
        },
        place: {
          connect: {
            uuid,
          },
        },
      },
      update: {
        deleted_at: existingHere?.deleted_at ? null : new Date(),
      },
      select: {
        deleted_at: true,
      },
    });

    return {
      here: !res.deleted_at,
    };
  }

  async update(
    uuid: string,
    updatePlaceDto: UpdatePlaceDto,
  ): Promise<ResponsePlaceDto> {
    const { categoryUuid, tags, images, services } = updatePlaceDto;

    const category = await this.prisma.placeCategory.findUnique({
      where: {
        uuid: categoryUuid,
      },
    });

    if (!category) {
      throw new BadRequestException('CATEGORY_NOT_FOUND');
    }

    const placeEntity = plainToClass(Place, updatePlaceDto);

    const updatedPlace = this.prisma.place.update({
      where: {
        uuid,
      },
      data: {
        ...placeEntity,
        category: {
          connect: {
            uuid: categoryUuid,
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
        services: {
          create: services.map((service) => ({
            service: {
              connect: {
                uuid: service,
              },
            },
          })),
        },
      },
      select: PlaceSelect,
    });

    return plainToClass(ResponsePlaceDto, updatedPlace);
  }

  async remove(uuid: string) {
    return this.prisma.place.update({
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
