import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ListingService } from './listing.service';
import { CreateListingDto } from './dto/create-listing.dto';
import { UpdateListingDto } from './dto/update-listing.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ResponseListingDto } from './dto/response-listing.dto';
import { RequestWithUser } from '../common/interfaces/RequestWithUser';
import { Resource } from '../auth/decorators/resource.decorator';
import { Action } from '../auth/decorators/action.decorator';
import { PermissionsGuard } from '../auth/guards/permissions-guard.service';
import { ResponseShortListingDto } from './dto/response-short-listing.dto';
import { RateListingDto } from './dto/rate-listing.dto';
import { ResponseSavedDto } from './dto/response-saved.dto';
import { Paginate } from '../common/decorators/paginate.decorator';
import { Pagination } from '../common/pagination';
import { PaginationResultDto } from '../common/dtos/pagination.dto';
import { ApiOkResponsePaginated } from '../common/decorators/paginate-swagger.decorator';
import { ApiQueryPaginated } from '../common/decorators/paginate-query.decorator';

@Controller('listing')
@ApiTags('listing')
export class ListingController {
  constructor(private readonly listingService: ListingService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiBody({
    type: CreateListingDto,
  })
  @ApiOkResponse({
    description: 'Create a new listing',
    type: ResponseListingDto,
    status: 201,
  })
  async create(
    @Req() req: RequestWithUser,
    @Body() createListingDto: CreateListingDto,
  ): Promise<ResponseListingDto> {
    return this.listingService.create(req.user, createListingDto);
  }

  @Get()
  @ApiQueryPaginated()
  @ApiQuery({
    name: 'category',
    required: false,
  })
  @ApiOkResponsePaginated(ResponseShortListingDto)
  async findAll(
    @Paginate() pagination: Pagination,
    @Query('category') category?: string,
  ): Promise<PaginationResultDto<ResponseShortListingDto>> {
    return this.listingService.findAll(pagination, category);
  }

  @Get(':uuid')
  @Action('view')
  @Resource('listing')
  @UseGuards(PermissionsGuard)
  @ApiBearerAuth()
  @ApiParam({
    name: 'uuid',
    type: String,
  })
  @ApiOkResponse({
    description: 'Get a listing by uuid',
    type: ResponseListingDto,
  })
  async findOne(@Param('uuid') uuid: string): Promise<ResponseListingDto> {
    return this.listingService.findOne(uuid);
  }

  @Post(':uuid/rate')
  @Action('view')
  @Resource('listing')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @ApiBearerAuth()
  @ApiParam({
    name: 'uuid',
    type: String,
  })
  @ApiBody({
    type: RateListingDto,
  })
  @ApiOkResponse({
    description: 'Rate a listing',
    type: RateListingDto,
    status: 201,
  })
  async rate(
    @Req() req: RequestWithUser,
    @Param('uuid') uuid: string,
    @Body() rateListingDto: RateListingDto,
  ): Promise<RateListingDto> {
    return this.listingService.rate(uuid, req.user.uuid, rateListingDto);
  }

  @Post(':uuid/save')
  @Action('view')
  @Resource('listing')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @ApiBearerAuth()
  @ApiParam({
    name: 'uuid',
    type: String,
  })
  @ApiOkResponse({
    description: 'Rate a listing',
    type: ResponseSavedDto,
    status: 201,
  })
  async save(
    @Param('uuid') uuid: string,
    @Req() req: RequestWithUser,
  ): Promise<ResponseSavedDto> {
    return this.listingService.save(uuid, req.user.uuid);
  }

  @Patch(':uuid')
  @Resource('listing')
  @Action('manage')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @ApiBearerAuth()
  @ApiParam({
    name: 'uuid',
    type: String,
  })
  @ApiBody({
    type: UpdateListingDto,
  })
  @ApiOkResponse({
    description: 'Update a listing by uuid',
    type: ResponseListingDto,
    status: 200,
  })
  async update(
    @Param('uuid') uuid: string,
    @Req() req: RequestWithUser,
    @Body() updateListingDto: UpdateListingDto,
  ): Promise<ResponseListingDto> {
    return this.listingService.update(uuid, req.user.uuid, updateListingDto);
  }

  @Delete(':uuid')
  @Resource('listing')
  @Action('manage')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @ApiBearerAuth()
  @ApiParam({
    name: 'uuid',
    type: String,
  })
  @ApiOkResponse({
    description: 'Delete a listing by uuid',
    status: 204,
  })
  async remove(@Param('uuid') uuid: string) {
    return this.listingService.remove(uuid);
  }
}
