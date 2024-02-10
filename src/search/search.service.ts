import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ListingSelect } from '../listing/selects/listing.select';
import { Pagination } from '../common/pagination';
import { commonWhereClause } from '../common/common.where';
import { PaginationResultDto } from '../common/dtos/pagination.dto';
import { plainToInstance } from 'class-transformer';
import { CardPlaceSelect } from '../place/selects/card-place.select';
import { ResponseCardPlaceDto } from '../place/dto/response-card-place.dto';
import { ResponseCardUserDto } from '../user/dtos/response-card-user.dto';
import { Status } from '@prisma/client';
import { roundRating } from '../common/utils/roundRating';
import { ResponseShortListingDto } from '../listing/dto/response-short-listing.dto';
import { SearchAllDto } from './dto/search-all.dto';

@Injectable()
export class SearchService {
  constructor(private readonly prisma: PrismaService) {}

  async searchAll(query: string): Promise<SearchAllDto> {
    const [listings, places, users] = await Promise.all([
      this.searchListings(query, {
        page: 1,
        limit: 6,
      }),
      this.searchPlaces(query, {
        page: 1,
        limit: 4,
      }),
      this.searchUsers(query, {
        page: 1,
        limit: 6,
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
  ): Promise<PaginationResultDto<ResponseShortListingDto>> {
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

    // TODO: Make the extraction of a thumbnail a separate function

    const result = foundListings.map((listing) => {
      const [thumbnail] = listing.images;
      return {
        ...listing,
        thumbnail,
      };
    });

    return {
      data: plainToInstance(ResponseShortListingDto, result),
      ...pagination,
      totalCount,
    };
  }

  async searchPlaces(
    query: string,
    pagination: Pagination,
  ): Promise<PaginationResultDto<ResponseCardPlaceDto>> {
    const whereClause = {
      deleted_at: null,
      status: Status.PUBLIC,
      creator: {
        deleted_at: null,
      },
    };

    const totalCount = await this.prisma.place.count({
      where: whereClause,
    });

    const foundPlaces = await this.prisma.place.findMany({
      where: whereClause,
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

    const ratings = await this.prisma.placeReview.groupBy({
      by: ['placeUuid'],
      _avg: {
        rating: true,
      },
      where: {
        placeUuid: { in: foundPlaces.map((place) => place.uuid) },
      },
    });

    const ratingsMap = new Map(
      ratings.map((r) => [r.placeUuid, r._avg.rating]),
    );

    const result = foundPlaces.map((place) => {
      const averageRating = ratingsMap.get(place.uuid) || 0;
      const [thumbnail] = place.images;

      return {
        ...place,
        thumbnail,
        rating: roundRating(averageRating),
      };
    });

    return {
      data: plainToInstance(ResponseCardPlaceDto, result),
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
