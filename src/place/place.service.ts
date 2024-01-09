import { Injectable } from '@nestjs/common';
import { CreatePlaceDto } from './dto/create-place.dto';
import { UpdatePlaceDto } from './dto/update-place.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PlaceService {
  constructor(private readonly prisma: PrismaService) {}

  create(createPlaceDto: CreatePlaceDto) {
    return 'This action adds a new place';
  }

  async findAll() {
    const places = await this.prisma.place.findMany({
      select: {
        uuid: true,
        name: true,
        icon: true,
        description: true,
        lng: true,
        lat: true,
      },
    });

    if (!places) {
      return [];
    }

    return places;
  }

  findOne(uuid: string) {
    return this.prisma.place.findUnique({
      where: {
        uuid,
      },
      select: {
        uuid: true,
        name: true,
        icon: true,
        description: true,
        category: {
          select: {
            uuid: true,
            name: true,
          },
        },
        lng: true,
        lat: true,
        images: {
          select: {
            uuid: true,
            url: true,
            alt: true,
          },
        },
        services: {
          select: {
            service: {
              select: {
                uuid: true,
                name: true,
                icon: true,
              },
            },
          },
        },
        tags: {
          select: {
            tag: {
              select: {
                uuid: true,
                name: true,
              },
            },
          },
        },
        visitors: {
          select: {
            uuid: true,
            created_at: true,
            user: {
              select: {
                uuid: true,
                name: true,
                username: true,
                bio: true,
                phone: true,
                profile_pic: true,
                header_pic: true,
              },
            },
          },
          orderBy: {
            created_at: 'desc',
          },
          take: 3,
        },
        reviews: {
          select: {
            uuid: true,
            rating: true,
            content: true,
            created_at: true,
            updated_at: true,
            user: {
              select: {
                uuid: true,
                name: true,
                username: true,
                profile_pic: true,
                header_pic: true,
              },
            },
          },
          orderBy: {
            created_at: 'desc',
          },
          take: 3,
        },
        status: true,
        creator: {
          select: {
            uuid: true,
            name: true,
            username: true,
            profile_pic: true,
            header_pic: true,
          },
        },
        owner: {
          select: {
            uuid: true,
            name: true,
            username: true,
            profile_pic: true,
            header_pic: true,
          },
        },
        created_at: true,
        updated_at: true,
      },
    });
  }

  update(id: number, updatePlaceDto: UpdatePlaceDto) {
    return `This action updates a #${id} place`;
  }

  remove(id: number) {
    return `This action removes a #${id} place`;
  }
}
