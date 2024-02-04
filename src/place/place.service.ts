import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePlaceDto } from './dto/create-place.dto';
import { UpdatePlaceDto } from './dto/update-place.dto';
import { PrismaService } from '../prisma/prisma.service';
import { CardPlaceSelect, PlaceSelect, ShortPlaceSelect } from './place.select';
import { Status } from '@prisma/client';

@Injectable()
export class PlaceService {
  constructor(private readonly prisma: PrismaService) {}

  create(createPlaceDto: CreatePlaceDto) {
    return 'This action adds a new place';
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

  async findOne(uuid: string) {
    const place = await this.prisma.place.findUnique({
      where: {
        uuid,
      },
      select: PlaceSelect,
    });

    if (!place) throw new NotFoundException('Place not found');

    return place;
  }

  async findOneMeta(uuid: string): Promise<{
    ownerId: string;
    status: Status;
  } | null> {
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
