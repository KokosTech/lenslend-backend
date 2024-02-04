import { forwardRef, Module } from '@nestjs/common';

import { ResourceService } from './resource.service';

import { ListingModule } from '../listing/listing.module';
import { PlaceModule } from '../place/place.module';
import { CommentModule } from '../listing/comment/comment.module';
import { ReviewModule } from '../place/review/review.module';

@Module({
  imports: [
    forwardRef(() => ListingModule),
    forwardRef(() => PlaceModule),
    forwardRef(() => CommentModule),
    forwardRef(() => ReviewModule),
  ],
  providers: [ResourceService],
  exports: [ResourceService],
})
export class ResourceModule {}
