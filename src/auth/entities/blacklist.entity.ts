import { ApiProperty } from '@nestjs/swagger';

export class BlacklistEntity {
  @ApiProperty()
  token: string;
  @ApiProperty()
  user: string;
  @ApiProperty()
  ttl: number;
}
