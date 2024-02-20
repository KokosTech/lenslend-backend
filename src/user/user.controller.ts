import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RequestWithUser } from '../common/interfaces/RequestWithUser';
import {
  ResponseProfileDto,
  ResponsePublicProfileDto,
} from './dtos/response-user.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserService } from './user.service';
import { ListingService } from '../listing/listing.service';
import { RateUserDto } from './dtos/rate-user.dto';
import { ApiQueryPaginated } from '../common/decorators/paginate-query.decorator';
import { ApiOkResponsePaginated } from '../common/decorators/paginate-swagger.decorator';
import { ResponseShortListingDto } from '../listing/dto/response-short-listing.dto';
import { PaginationResultDto } from '../common/dtos/pagination.dto';
import { Paginate } from '../common/decorators/paginate.decorator';
import { Pagination } from '../common/pagination';
import { Status } from '@prisma/client';
import { ResponseCardPlaceDto } from '../place/dto/response-card-place.dto';
import { PlaceService } from '../place/place.service';

@Controller('user')
@ApiTags('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly listingService: ListingService,
    private readonly placeService: PlaceService,
  ) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    type: ResponseProfileDto,
  })
  async getMe(@Req() req: RequestWithUser): Promise<ResponseProfileDto> {
    return this.userService.getUserProfile(req.user.uuid);
  }

  @Get('me/listing')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiQueryPaginated()
  @ApiOkResponsePaginated(ResponseShortListingDto)
  async getMyListings(
    @Req() req: RequestWithUser,
    @Paginate() pagination: Pagination,
  ): Promise<PaginationResultDto<ResponseShortListingDto>> {
    return this.listingService.findByUsername(pagination, req.user.username);
  }

  @Get('me/place')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiQueryPaginated()
  @ApiOkResponsePaginated(ResponseCardPlaceDto)
  async getMyPlaces(
    @Req() req: RequestWithUser,
    @Paginate() pagination: Pagination,
  ): Promise<PaginationResultDto<ResponseCardPlaceDto>> {
    const places = await this.placeService.findAll(
      pagination,
      'card',
      req.user.username,
    );

    return places as PaginationResultDto<ResponseCardPlaceDto>;
  }

  @Get('me/saved/listing')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiQueryPaginated()
  @ApiOkResponsePaginated(ResponseShortListingDto)
  async getSavedListings(
    @Req() req: RequestWithUser,
    @Paginate() pagination: Pagination,
  ): Promise<PaginationResultDto<ResponseShortListingDto>> {
    return this.listingService.getSavedListings(pagination, req.user.uuid);
  }

  @Get('me/saved/place')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiQueryPaginated()
  @ApiOkResponsePaginated(ResponseCardPlaceDto)
  async getSavedPlaces(
    @Req() req: RequestWithUser,
    @Paginate() pagination: Pagination,
  ): Promise<PaginationResultDto<ResponseCardPlaceDto>> {
    return this.placeService.getSavedPlaces(pagination, req.user.uuid);
  }

  @Get('profile')
  @ApiQueryPaginated()
  @ApiOkResponsePaginated(ResponsePublicProfileDto)
  async getProfiles(
    @Paginate() pagination: Pagination,
  ): Promise<PaginationResultDto<ResponsePublicProfileDto>> {
    return this.userService.getPublicProfiles(pagination);
  }

  @Get(':username')
  @ApiResponse({
    status: 200,
    type: ResponsePublicProfileDto,
  })
  async getProfile(
    @Param('username') username: string,
  ): Promise<ResponsePublicProfileDto> {
    return this.userService.getPublicProfile(username);
  }

  @Get(':username/listing')
  @ApiQueryPaginated()
  @ApiOkResponsePaginated(ResponseShortListingDto)
  async getProfileListings(
    @Param('username') username: string,
    @Paginate() pagination: Pagination,
  ): Promise<PaginationResultDto<ResponseShortListingDto>> {
    return this.listingService.findByUsername(
      pagination,
      username,
      Status.PUBLIC,
    );
  }

  @Get(':username/place')
  @ApiQueryPaginated()
  @ApiOkResponsePaginated(ResponseCardPlaceDto)
  async getProfilePlaces(
    @Param('username') username: string,
    @Paginate() pagination: Pagination,
  ): Promise<PaginationResultDto<ResponseCardPlaceDto>> {
    return this.placeService.findAll(
      pagination,
      'card',
      username,
      Status.PUBLIC,
    ) as Promise<PaginationResultDto<ResponseCardPlaceDto>>;
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiTags('admin')
  @ApiQueryPaginated()
  @ApiOkResponsePaginated(ResponseProfileDto)
  async getUsers(
    @Paginate() pagination: Pagination,
  ): Promise<PaginationResultDto<ResponseProfileDto>> {
    return this.userService.findAll(pagination);
  }

  @Post('rate/:username')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiBody({ type: RateUserDto })
  @ApiResponse({
    status: 200,
    type: RateUserDto,
  })
  async rate(
    @Req() req: RequestWithUser,
    @Param('username') username: string,
    @Body() rateUserDto: RateUserDto,
  ) {
    return this.userService.rate(req.user.uuid, username, rateUserDto);
  }
}
