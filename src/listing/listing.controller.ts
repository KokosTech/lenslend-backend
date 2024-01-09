import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ListingService } from './listing.service';
import { CreateListingDto } from './dto/create-listing.dto';
import { UpdateListingDto } from './dto/update-listing.dto';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ResponseListingDto } from './dto/response-listing.dto';

@Controller('listing')
@ApiTags('listing')
export class ListingController {
  constructor(private readonly listingService: ListingService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  create(@Body() createListingDto: CreateListingDto) {
    return this.listingService.create(createListingDto);
  }

  @Get()
  // @ApiOkResponse({
  //   description: 'List of all listings',
  //   type: [ResponseListingDto],
  // })
  findAll() {
    return this.listingService.findAll();
  }

  @Get(':id')
  @ApiParam({
    name: 'id',
    type: String,
  })
  @ApiOkResponse({
    description: 'Get a listing by id',
    type: ResponseListingDto,
  })
  findOne(@Param('id') id: string) {
    return this.listingService.findOne(id);
  }

  @Post(':id/rate')
  rate() {
    return 'Not implemented';
  }

  @Post(':id/save')
  save() {
    return 'Not implemented';
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateListingDto: UpdateListingDto) {
    return this.listingService.update(+id, updateListingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.listingService.remove(+id);
  }
}
