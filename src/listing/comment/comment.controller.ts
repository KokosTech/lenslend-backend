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
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RequestWithUser } from '../../common/interfaces/RequestWithUser';
import { PermissionsGuard } from '../../auth/guards/permissions-guard.service';
import { Resource } from '../../auth/decorators/resource.decorator';
import { Action } from '../../auth/decorators/action.decorator';

@ApiTags('listing/comment')
@Controller('listing/:uuid/comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Req() req: RequestWithUser,
    @Body() createCommentDto: CreateCommentDto,
    @Param('uuid') uuid: string,
  ) {
    return this.commentService.create(req.user.uuid, uuid, createCommentDto);
  }

  @Get()
  @Action('view')
  @Resource('listing')
  @UseGuards(PermissionsGuard)
  findAll(@Param('uuid') uuid: string) {
    return this.commentService.findAll(uuid);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commentService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto) {
    return this.commentService.update(+id, updateCommentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.commentService.remove(+id);
  }
}
