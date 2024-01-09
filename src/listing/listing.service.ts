import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateListingDto } from './dto/create-listing.dto';
import { UpdateListingDto } from './dto/update-listing.dto';
import { PrismaService } from '../prisma/prisma.service';
import { UserService } from '../user/user.service';
import { plainToClass } from 'class-transformer';
import { Listing } from './entities/listing.entity';
import { ListingSelect, ShortListingSelect } from './listing.select';

@Injectable()
export class ListingService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
  ) {}

  async create(createListingDto: CreateListingDto) {
    const user = await this.userService.findByUUID(createListingDto.userId);

    if (!user) {
      throw new NotFoundException('USER_NOT_FOUND');
    }

    const { categoryId } = createListingDto;

    const listingEntity = plainToClass(Listing, createListingDto);

    return this.prisma.listing.create({
      data: {
        ...listingEntity,
        category: {
          connect: {
            uuid: categoryId,
          },
        },
        user: {
          connect: {
            uuid: user.uuid,
          },
        },
      },
      select: {
        uuid: true,
        title: true,
        description: true,
        type: true,
        price: true,
        state: true,
        rental: true,
        negotiable: true,
        status: true,
        category: {
          select: {
            uuid: true,
            name: true,
          },
        },
        user: {
          select: {
            uuid: true,
            name: true,
            username: true,
          },
        },
        created_at: true,
      },
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
