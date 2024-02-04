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
import { RequestWithUser } from '../common/interfaces/RequestWithUser';
import { Resource } from '../auth/decorators/resource.decorator';
import { Action } from '../auth/decorators/action.decorator';
import { OwnerGuard } from '../auth/guards/owner.guard';

@Controller('listing')
@ApiTags('listing')
export class ListingController {
  constructor(private readonly listingService: ListingService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Create a new listing',
    type: ResponseListingDto,
  })
  async create(
    @Req() req: RequestWithUser,
    @Body() createListingDto: CreateListingDto,
  ) {
    return this.listingService.create(req.user, createListingDto);
  }

  @Get()
  @ApiOkResponse({
    description: 'List of all listings',
    type: [ResponseListingDto],
  })
  findAll() {
    return this.listingService.findAll();
  }

  @Get(':uuid')
  @Action('view')
  @Resource('listing')
  @UseGuards(OwnerGuard)
  @ApiBearerAuth()
  @ApiParam({
    name: 'uuid',
    type: String,
  })
  @ApiOkResponse({
    description: 'Get a listing by uuid',
    type: ResponseListingDto,
  })
  findOne(@Param('uuid') uuid: string) {
    return this.listingService.findOne(uuid);
  }

  @Post(':uuid/rate')
  rate() {
    return 'Not implemented';
  }

  @Post(':uuid/save')
  save() {
    return 'Not implemented';
  }

  @Patch(':uuid')
  @Resource('listing')
  @Action('manage')
  @UseGuards(JwtAuthGuard, OwnerGuard)
  @ApiBearerAuth()
  update(
    @Param('uuid') uuid: string,
    @Req() req: RequestWithUser,
    @Body() updateListingDto: UpdateListingDto,
  ) {
    return this.listingService.update(uuid, req.user, updateListingDto);
  }

  @Delete(':uuid')
  remove(@Param('uuid') uuid: string) {
    return this.listingService.remove(uuid);
  }
}
