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
import { PlaceService } from './place.service';
import { CreatePlaceDto } from './dto/create-place.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiExtraModels,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { RequestWithUser } from '../common/interfaces/RequestWithUser';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ResponsePlaceDto } from './dto/response-place.dto';
import { ResponseCardPlaceDto } from './dto/response-card-place.dto';
import { ResponseShortPlaceDto } from './dto/response-short-place.dto';
import { Action } from '../auth/decorators/action.decorator';
import { Resource } from '../auth/decorators/resource.decorator';
import { PermissionsGuard } from '../auth/guards/permissions-guard.service';
import { UpdatePlaceDto } from './dto/update-place.dto';
import { ResponseHereDto } from './dto/response-here.dto';
import { ResponseSavedDto } from '../listing/dto/response-saved.dto';
import { PaginationResultDto } from '../common/dtos/pagination.dto';
import { ApiParamPaginated } from '../common/decorators/paginate-query.decorator';
import { ApiOkResponsePaginated } from '../common/decorators/paginate-swagger.decorator';
import { ResponseShortListingDto } from '../listing/dto/response-short-listing.dto';
import { Paginate } from '../common/decorators/paginate.decorator';
import { Pagination } from '../common/pagination';

@ApiTags('place')
@Controller('place')
export class PlaceController {
  constructor(private readonly placeService: PlaceService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiBody({
    type: CreatePlaceDto,
  })
  @ApiResponse({
    status: 201,
    type: ResponsePlaceDto,
  })
  async create(
    @Req() req: RequestWithUser,
    @Body() createPlaceDto: CreatePlaceDto,
  ): Promise<ResponsePlaceDto> {
    return this.placeService.create(req.user, createPlaceDto);
  }

  @Get()
  @ApiQuery({
    name: 'format',
    enum: ['short', 'card'],
    required: false,
  })
  @ApiParamPaginated()
  @ApiOkResponsePaginated(ResponseShortListingDto)
  @ApiExtraModels(ResponseCardPlaceDto, ResponseShortPlaceDto)
  @ApiResponse({
    status: 200,
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: {
            oneOf: [
              { $ref: getSchemaPath(ResponseCardPlaceDto) },
              { $ref: getSchemaPath(ResponseShortPlaceDto) },
            ],
          },
        },
        examples: {
          ResponseCardPlaceDto: { value: ResponseCardPlaceDto },
          ResponseShortPlaceDto: { value: ResponseShortPlaceDto },
        },
      },
    },
  })
  async findAll(
    @Paginate() pagination: Pagination,
    @Query('format') format?: 'short' | 'card',
  ): Promise<
    PaginationResultDto<ResponseCardPlaceDto | ResponseShortPlaceDto>
  > {
    return this.placeService.findAll(pagination, format);
  }

  @Get(':uuid')
  @Action('view')
  @Resource('place')
  @UseGuards(PermissionsGuard)
  @ApiBearerAuth()
  @ApiParam({
    name: 'uuid',
    type: String,
  })
  @ApiResponse({
    status: 200,
    type: ResponsePlaceDto,
  })
  async findOne(@Param('uuid') uuid: string): Promise<ResponsePlaceDto> {
    return this.placeService.findOne(uuid);
  }

  @Post(':uuid/save')
  @Action('view')
  @Resource('place')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @ApiBearerAuth()
  @ApiParam({
    name: 'uuid',
    type: String,
  })
  @ApiResponse({
    status: 201,
    type: ResponseSavedDto,
  })
  async save(
    @Req() req: RequestWithUser,
    @Param('uuid') uuid: string,
  ): Promise<ResponseSavedDto> {
    return this.placeService.save(uuid, req.user.uuid);
  }

  @Post(':uuid/here')
  @Action('view')
  @Resource('place')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @ApiBearerAuth()
  @ApiParam({
    name: 'uuid',
    type: String,
  })
  @ApiResponse({
    status: 201,
    type: ResponseHereDto,
  })
  async here(
    @Req() req: RequestWithUser,
    @Param('uuid') uuid: string,
  ): Promise<ResponseHereDto> {
    return this.placeService.here(uuid, req.user.uuid);
  }

  @Patch(':uuid')
  @Action('manage')
  @Resource('place')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @ApiBearerAuth()
  @ApiParam({
    name: 'uuid',
    type: String,
  })
  @ApiBody({
    type: UpdatePlaceDto,
  })
  @ApiResponse({
    status: 200,
    type: ResponsePlaceDto,
  })
  async update(
    @Param('uuid') uuid: string,
    @Body() updatePlaceDto: UpdatePlaceDto,
  ): Promise<ResponsePlaceDto> {
    return this.placeService.update(uuid, updatePlaceDto);
  }

  @Delete(':uuid')
  @Action('manage')
  @Resource('place')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @ApiBearerAuth()
  @ApiParam({
    name: 'uuid',
    type: String,
  })
  @ApiResponse({
    status: 204,
    description: 'Place deleted',
  })
  remove(@Param('uuid') uuid: string) {
    return this.placeService.remove(uuid);
  }
}
