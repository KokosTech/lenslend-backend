import { Controller, Get, Query } from '@nestjs/common';
import { SearchService } from './search.service';
import { ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Pagination } from '../common/pagination';
import { Paginate } from '../common/decorators/paginate.decorator';
import { PaginationResultDto } from '../common/dtos/pagination.dto';
import { ResponseCardUserDto } from '../user/dtos/response-card-user.dto';
import { ResponseListingDto } from '../listing/dto/response-listing.dto';
import { ResponseCardPlaceDto } from '../place/dto/response-card-place.dto';
import { SearchAllDto } from './dto/search-all.dto';
import { ApiParamPaginated } from '../common/decorators/paginate-query.decorator';
import { ApiOkResponsePaginated } from '../common/decorators/paginate-swagger.decorator';

@Controller('search')
@ApiTags('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  @ApiQuery({
    name: 'search',
    required: true,
    type: String,
  })
  @ApiQuery({
    name: 'category',
    required: false,
    type: 'enum',
    enum: ['Freelancers', 'Equipment', 'Places'],
  })
  @ApiParamPaginated()
  @ApiOkResponsePaginated(
    ResponseListingDto || ResponseCardPlaceDto || ResponseCardUserDto,
  )
  @ApiOkResponse({ type: SearchAllDto })
  async search(
    @Query('search') search: string,
    @Paginate() pagination: Pagination,
    @Query('category') category?: 'Freelancers' | 'Equipment' | 'Places',
  ): Promise<
    | PaginationResultDto<
        ResponseListingDto | ResponseCardPlaceDto | ResponseCardUserDto
      >
    | SearchAllDto
  > {
    search = search.split(' ').join(' & ');

    switch (category) {
      case 'Freelancers':
        return this.searchService.searchUsers(search, pagination);
      case 'Equipment':
        return this.searchService.searchListings(search, pagination);
      case 'Places':
        return this.searchService.searchPlaces(search, pagination);
      default:
        return this.searchService.searchAll(search);
    }
  }
}
