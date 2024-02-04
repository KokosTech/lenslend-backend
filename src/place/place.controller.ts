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
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { RequestWithUser } from '../common/interfaces/RequestWithUser';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('place')
@Controller('place')
export class PlaceController {
  constructor(private readonly placeService: PlaceService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async create(
    @Req() req: RequestWithUser,
    @Body() createPlaceDto: CreatePlaceDto,
  ) {
    return this.placeService.create(req.user, createPlaceDto);
  }

  @Get()
  @ApiQuery({
    name: 'format',
    enum: ['short', 'card'],
    required: false,
  })
  findAll(@Query('format') format?: 'short' | 'card') {
    return this.placeService.findAll(format);
  }

  @Get(':uuid')
  async findOne(@Param('uuid') uuid: string) {
    return this.placeService.findOne(uuid);
  }

  @Post(':id/rate')
  rate() {
    return 'Not implemented';
  }

  @Post(':id/save')
  @Patch(':id')
  save() {
    return 'Not implemented';
  }

  @Post(':id/here')
  here() {
    return 'Not implemented';
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.placeService.remove(+id);
  }
}
