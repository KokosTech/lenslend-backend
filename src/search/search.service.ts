import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ListingSelect } from '../listing/selects/listing.select';
import { ResponseListingDto } from '../listing/dto/response-listing.dto';
import { Pagination } from '../common/pagination';
import { commonWhereClause } from '../common/common.where';
import { PaginationResultDto } from '../common/dtos/pagination.dto';
import { plainToInstance } from 'class-transformer';
import { CardPlaceSelect } from '../place/selects/card-place.select';
import { ResponseCardPlaceDto } from '../place/dto/response-card-place.dto';
import { ResponseCardUserDto } from '../user/dtos/response-card-user.dto';

@Injectable()
export class SearchService {
  constructor(private readonly prisma: PrismaService) {}

  async searchAll(query: string): Promise<{
    listings: PaginationResultDto<ResponseListingDto>;
    places: PaginationResultDto<ResponseCardPlaceDto>;
    users: PaginationResultDto<ResponseCardUserDto>;
  }> {
    const [listings, places, users] = await Promise.all([
      this.searchListings(query, {
        page: 1,
        limit: 6,
      }),
      this.searchPlaces(query, {
        page: 1,
        limit: 6,
      }),
      this.searchUsers(query, {
        page: 1,
        limit: 12,
      }),
    ]);

    return {
      listings,
      places,
      users,
    };
  }

  async searchListings(
    query: string,
    pagination: Pagination,
  ): Promise<PaginationResultDto<ResponseListingDto>> {
    const totalCount = await this.prisma.listing.count({
      where: commonWhereClause,
    });

    const foundListings = await this.prisma.listing.findMany({
      select: ListingSelect,
      where: commonWhereClause,
      orderBy: {
        _relevance: {
          fields: ['title', 'description'],
          search: query,
          sort: 'desc',
        },
      },
      skip: pagination.page * pagination.limit - pagination.limit,
      take: pagination.limit,
    });

    return {
      data: plainToInstance(ResponseListingDto, foundListings),
      ...pagination,
      totalCount,
    };
  }

  async searchPlaces(
    query: string,
    pagination: Pagination,
  ): Promise<PaginationResultDto<ResponseCardPlaceDto>> {
    const totalCount = await this.prisma.place.count({
      where: commonWhereClause,
    });

    const foundPlaces = await this.prisma.place.findMany({
      where: commonWhereClause,
      select: CardPlaceSelect,
      orderBy: {
        _relevance: {
          fields: ['name', 'description'],
          search: query,
          sort: 'desc',
        },
      },
      skip: pagination.page * pagination.limit - pagination.limit,
      take: pagination.limit,
    });

    return {
      data: plainToInstance(ResponseCardPlaceDto, foundPlaces),
      ...pagination,
      totalCount,
    };
  }

  async searchUsers(
    query: string,
    pagination: Pagination,
  ): Promise<PaginationResultDto<ResponseCardUserDto>> {
    const totalCount = await this.prisma.user.count({
      where: {
        deleted_at: null,
      },
    });

    const foundUsers = await this.prisma.user.findMany({
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
      skip: pagination.page * pagination.limit - pagination.limit,
      take: pagination.limit,
    });

    return {
      data: plainToInstance(ResponseCardUserDto, foundUsers),
      ...pagination,
      totalCount,
    };
  }
}
