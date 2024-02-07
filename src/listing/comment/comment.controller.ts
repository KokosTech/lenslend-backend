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
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RequestWithUser } from '../../common/interfaces/RequestWithUser';
import { PermissionsGuard } from '../../auth/guards/permissions-guard.service';
import { Resource } from '../../auth/decorators/resource.decorator';
import { Action } from '../../auth/decorators/action.decorator';
import { ResponseCommentDto } from './dto/response-comment-dto';
import { ApiParamPaginated } from '../../common/decorators/paginate-query.decorator';
import { ApiOkResponsePaginated } from '../../common/decorators/paginate-swagger.decorator';
import { PaginationResultDto } from '../../common/dtos/pagination.dto';
import { Paginate } from '../../common/decorators/paginate.decorator';
import { Pagination } from '../../common/pagination';

@ApiTags('listing/comment')
@Controller('listing/:uuid/comment')
@ApiParam({
  name: 'uuid',
  required: true,
  description: 'Listing UUID',
})
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  @Action('view')
  @Resource('listing')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @ApiBearerAuth()
  @ApiBody({
    type: CreateCommentDto,
  })
  @ApiResponse({
    status: 201,
    type: ResponseCommentDto,
  })
  async create(
    @Req() req: RequestWithUser,
    @Body() createCommentDto: CreateCommentDto,
    @Param('uuid') uuid: string,
  ): Promise<ResponseCommentDto> {
    return this.commentService.create(req.user.uuid, uuid, createCommentDto);
  }

  @Get()
  @Action('view')
  @Resource('listing')
  @UseGuards(PermissionsGuard)
  @ApiBearerAuth()
  @ApiParamPaginated()
  @ApiOkResponsePaginated(ResponseCommentDto)
  async findAll(
    @Param('uuid') uuid: string,
    @Paginate() pagination: Pagination,
  ): Promise<PaginationResultDto<ResponseCommentDto>> {
    return this.commentService.findAll(uuid, pagination);
  }

  @Get(':sub_uuid')
  @Action('view')
  @Resource('comment')
  @UseGuards(PermissionsGuard)
  @ApiBearerAuth()
  @ApiParam({
    name: 'sub_uuid',
    required: true,
    description: 'Comment UUID',
  })
  @ApiResponse({
    status: 200,
    type: ResponseCommentDto,
  })
  async findOne(@Param('sub_uuid') uuid: string): Promise<ResponseCommentDto> {
    return this.commentService.findOne(uuid);
  }

  @Patch(':sub_uuid')
  @Action('manage')
  @Resource('comment')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @ApiBearerAuth()
  @ApiParam({
    name: 'sub_uuid',
    required: true,
    description: 'Comment UUID',
  })
  @ApiBody({
    type: UpdateCommentDto,
  })
  @ApiResponse({
    status: 200,
    type: ResponseCommentDto,
  })
  async update(
    @Param('sub_uuid') uuid: string,
    @Body() updateCommentDto: UpdateCommentDto,
  ): Promise<ResponseCommentDto> {
    return this.commentService.update(uuid, updateCommentDto);
  }

  @Delete(':sub_uuid')
  @Action('manage')
  @Resource('comment')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @ApiBearerAuth()
  @ApiParam({
    name: 'sub_uuid',
    required: true,
    description: 'Comment UUID',
  })
  @ApiResponse({
    status: 200,
  })
  async remove(@Param('sub_uuid') uuid: string) {
    return this.commentService.remove(uuid);
  }
}
