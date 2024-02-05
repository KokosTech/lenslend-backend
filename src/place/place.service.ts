import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePlaceDto } from './dto/create-place.dto';
import { UpdatePlaceDto } from './dto/update-place.dto';
import { PrismaService } from '../prisma/prisma.service';
import { CardPlaceSelect, PlaceSelect, ShortPlaceSelect } from './place.select';
import { ResourceContent } from '../resource/types/resource.type';
import { plainToClass } from 'class-transformer';
import { User } from '@prisma/client';
import { Place } from './entities/place.entity';
import { ResponsePlaceDto } from './dto/response-place.dto';

@Injectable()
export class PlaceService {
  constructor(private readonly prisma: PrismaService) {}

  async create(user: User, createPlaceDto: CreatePlaceDto) {
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

    return this.prisma.place.create({
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
  }

  async findAll(format?: 'short' | 'card') {
    const places = await this.prisma.place.findMany({
      select: format === 'short' ? ShortPlaceSelect : CardPlaceSelect,
    });

    if (!places) {
      return [];
    }

    return places;
  }

  async findOne(uuid: string): Promise<ResponsePlaceDto> {
    const place = await this.prisma.place.findUnique({
      where: {
        uuid,
      },
      select: PlaceSelect,
    });

    if (!place) throw new NotFoundException('Place not found');
    const averageRating = await this.prisma.placeReview.aggregate({
      where: {
        placeUuid: uuid,
      },
      _avg: {
        rating: true,
      },
    });

    let rounded = 0;

    // eslint-disable-next-line no-underscore-dangle
    if (averageRating._avg.rating) {
      // eslint-disable-next-line no-underscore-dangle
      rounded = Math.round(averageRating._avg.rating * 10) / 10;
    }

    return plainToClass(ResponsePlaceDto, {
      ...place,
      rating: rounded,
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

  update(id: number, updatePlaceDto: UpdatePlaceDto) {
    return `This action updates a #${id} place`;
  }

  remove(id: number) {
    return `This action removes a #${id} place`;
  }
}
