import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Status } from '@prisma/client';
import { ListingSelect } from '../listing/selects/listing.select';
import { plainToInstance } from 'class-transformer';
import { ResponseListingDto } from '../listing/dto/response-listing.dto';

@Injectable()
export class SearchService {
  constructor(private readonly prisma: PrismaService) {}

  async searchAll(query: string) {
    query = query.split(' ').join(' & ');
    const [listings, places, users] = await Promise.all([
      this.searchListings(query, 6),
      this.searchPlaces(query, 6),
      this.searchUsers(query, 12),
    ]);

    return {
      listings,
      places,
      users,
    };
  }

  async searchListings(
    query: string,
    limit?: number,
  ): Promise<ResponseListingDto[]> {
    const foundListings = await this.prisma.listing.findMany({
      select: ListingSelect,
      where: {
        status: Status.PUBLIC,
        deleted_at: null,
      },
      orderBy: {
        _relevance: {
          fields: ['title', 'description'],
          search: query,
          sort: 'desc',
        },
      },
      take: limit,
    });

    return plainToInstance(ResponseListingDto, foundListings);
  }

  async searchPlaces(query: string, limit?: number) {
    return this.prisma.place.findMany({
      where: {
        status: Status.PUBLIC,
        deleted_at: null,
      },
      include: {
        images: {
          where: {
            order: 1,
          },
        },
      },
      orderBy: {
        _relevance: {
          fields: ['name', 'description'],
          search: query,
          sort: 'desc',
        },
      },
      take: limit,
    });
  }

  async searchUsers(query: string, limit?: number) {
    return this.prisma.user.findMany({
      where: {
        deleted_at: null,
      },
      orderBy: {
        _relevance: {
          fields: ['username', 'name', 'bio'],
          search: query,
          sort: 'desc',
        },
      },
      take: limit,
    });
  }
}
