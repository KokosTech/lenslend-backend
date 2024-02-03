import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Status } from '@prisma/client';
import { ListingSelect } from '../listing/listing.select';

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

  async searchListings(query: string, limit?: number) {
    return this.prisma.listing.findMany({
      select: ListingSelect,
      where: {
        status: Status.PUBLIC,
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
  }

  async searchPlaces(query: string, limit?: number) {
    return this.prisma.place.findMany({
      where: {
        status: Status.PUBLIC,
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
      orderBy: {
        _relevance: {
          fields: ['name', 'bio'],
          search: query,
          sort: 'desc',
        },
      },
      take: limit,
    });
  }
}
