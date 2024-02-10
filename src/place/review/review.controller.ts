import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RequestWithUser } from '../../common/interfaces/RequestWithUser';
import {
  ApiBearerAuth,
  ApiBody,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ResponseReviewDto } from './dto/response-review.dto';
import { PermissionsGuard } from '../../auth/guards/permissions-guard.service';
import { Action } from '../../auth/decorators/action.decorator';
import { Resource } from '../../auth/decorators/resource.decorator';
import { ApiQueryPaginated } from '../../common/decorators/paginate-query.decorator';
import { ApiOkResponsePaginated } from '../../common/decorators/paginate-swagger.decorator';
import { PaginationResultDto } from '../../common/dtos/pagination.dto';
import { Paginate } from '../../common/decorators/paginate.decorator';
import { Pagination } from '../../common/pagination';

@ApiTags('place/review')
@ApiParam({
  name: 'uuid',
  required: true,
  description: 'Place UUID',
})
@Controller('/place/:uuid/review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post('')
  @Action('view')
  @Resource('place')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @ApiBearerAuth()
  @ApiBody({ type: CreateReviewDto })
  @ApiResponse({
    status: 201,
    type: ResponseReviewDto,
  })
  async create(
    @Req() req: RequestWithUser,
    @Body() createReviewDto: CreateReviewDto,
    @Param('uuid') uuid: string,
  ): Promise<ResponseReviewDto> {
    return this.reviewService.create(req.user.uuid, uuid, createReviewDto);
  }

  @Get()
  @ApiQueryPaginated()
  @ApiOkResponsePaginated(ResponseReviewDto)
  async findAll(
    @Param('uuid') uuid: string,
    @Paginate() pagination: Pagination,
  ): Promise<PaginationResultDto<ResponseReviewDto>> {
    return this.reviewService.findAll(uuid, pagination);
  }

  @Get('my-review')
  @Action('view')
  @Resource('place')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    type: ResponseReviewDto,
  })
  async findOneUserReview(
    @Req() req: RequestWithUser,
    @Param('uuid') uuid: string,
  ): Promise<ResponseReviewDto> {
    return this.reviewService.findOneUserReview(req.user.uuid, uuid);
  }

  @Get(':sub_uuid')
  @Action('view')
  @Resource('place')
  @UseGuards(PermissionsGuard)
  @ApiBearerAuth()
  @ApiParam({
    name: 'sub_uuid',
    type: String,
  })
  @ApiResponse({
    status: 200,
    type: ResponseReviewDto,
  })
  async findOne(@Param('sub_uuid') uuid: string): Promise<ResponseReviewDto> {
    return this.reviewService.findOne(uuid);
  }

  @Patch(':sub_uuid')
  @Action('manage')
  @Resource('review')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @ApiBearerAuth()
  @ApiParam({
    name: 'sub_uuid',
    type: String,
  })
  @ApiBody({ type: UpdateReviewDto })
  @ApiResponse({
    status: 200,
    type: ResponseReviewDto,
  })
  async update(
    @Param('sub_uuid') uuid: string,
    @Body() updateReviewDto: UpdateReviewDto,
  ): Promise<ResponseReviewDto> {
    return this.reviewService.update(uuid, updateReviewDto);
  }

  @Delete(':sub_uuid')
  @Action('manage')
  @Resource('review')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @ApiBearerAuth()
  @ApiParam({
    name: 'sub_uuid',
    type: String,
  })
  remove(@Param('sub_uuid') uuid: string) {
    return this.reviewService.remove(uuid);
  }
}
