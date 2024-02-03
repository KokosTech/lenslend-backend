import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Status, User } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RequestWithUser } from '../common/interfaces/RequestWithUser';
import {
  ResponseProfileDto,
  ResponsePublicProfileDto,
} from './dtos/response-user.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserService } from './user.service';
import { ListingService } from '../listing/listing.service';
import { ResponseListingDto } from '../listing/dto/response-listing.dto';

@Controller('user')
@ApiTags('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly listingService: ListingService,
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
  @ApiResponse({
    status: 200,
    type: [ResponseListingDto],
  })
  async getMyListings(@Req() req: RequestWithUser) {
    return this.listingService.getListingsByUsername(req.user.username);
  }

  @Get('profile')
  async getProfiles(): Promise<ResponsePublicProfileDto[]> {
    return this.userService.getPublicProfiles();
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
  @ApiResponse({
    status: 200,
    type: [ResponseListingDto],
  })
  async getProfileListings(@Param('username') username: string) {
    return this.listingService.getListingsByUsername(username, Status.PUBLIC);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiTags('admin')
  async getUsers(): Promise<User[]> {
    return this.userService.findAll();
  }
}
