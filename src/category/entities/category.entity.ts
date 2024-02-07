import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class Category {
  @Expose()
  name: string;

  @Expose()
  parent_uuid?: string;
}
