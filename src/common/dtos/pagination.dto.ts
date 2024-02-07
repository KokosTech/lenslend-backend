import { ApiProperty } from '@nestjs/swagger';

export class PaginationResultDto<T> {
  data: T[];
  @ApiProperty()
  page: number;
  @ApiProperty()
  limit: number;
  @ApiProperty()
  totalCount: number;

  constructor(data: T[], page: number, limit: number, totalCount: number) {
    this.data = data;
    this.page = page;
    this.limit = limit;
    this.totalCount = totalCount;
  }
}
