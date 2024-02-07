import { Exclude } from 'class-transformer';
import { PaginationResultDto } from '../../common/dtos/pagination.dto';
import { ResponseListingDto } from '../../listing/dto/response-listing.dto';
import { ResponseCardPlaceDto } from '../../place/dto/response-card-place.dto';
import { ResponseCardUserDto } from '../../user/dtos/response-card-user.dto';

@Exclude()
export class SearchAllDto {
  listings: PaginationResultDto<ResponseListingDto>;
  places: PaginationResultDto<ResponseCardPlaceDto>;
  users: PaginationResultDto<ResponseCardUserDto>;
}
