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
  ApiProperty,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('place/review')
@Controller('/place/:uuid/review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiProperty({ type: CreateReviewDto })
  @ApiResponse({ status: 201 })
  async create(
    @Req() req: RequestWithUser,
    @Body() createReviewDto: CreateReviewDto,
    @Param('uuid') uuid: string,
  ) {
    return this.reviewService.create(req.user.uuid, uuid, createReviewDto);
  }

  @Get()
  async findAll(@Param('place_uuid') uuid: string) {
    return this.reviewService.findAll(uuid);
  }

  @Get('my-review')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async findOneUserReview(
    @Req() req: RequestWithUser,
    @Param('uuid') uuid: string,
  ) {
    const rev = await this.reviewService.findOneUserReview(req.user.uuid, uuid);
    console.log('rev', rev);
    return rev;
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.reviewService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReviewDto: UpdateReviewDto) {
    return this.reviewService.update(+id, updateReviewDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reviewService.remove(+id);
  }
}
