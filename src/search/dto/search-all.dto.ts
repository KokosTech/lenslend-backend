import { Exclude } from 'class-transformer';
import { PaginationResultDto } from '../../common/dtos/pagination.dto';
import { ResponseCardPlaceDto } from '../../place/dto/response-card-place.dto';
import { ResponseCardUserDto } from '../../user/dtos/response-card-user.dto';
import { ResponseShortListingDto } from '../../listing/dto/response-short-listing.dto';

@Exclude()
export class SearchAllDto {
  listings: PaginationResultDto<ResponseShortListingDto>;
  places: PaginationResultDto<ResponseCardPlaceDto>;
  users: PaginationResultDto<ResponseCardUserDto>;
}
