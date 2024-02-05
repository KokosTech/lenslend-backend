import { Injectable, NotFoundException } from '@nestjs/common';

import { ListingService } from '../listing/listing.service';
import { PlaceService } from '../place/place.service';
import { CommentService } from '../listing/comment/comment.service';
import { ReviewService } from '../place/review/review.service';
import { ResourceContent, ResourceType } from './types/resource.type';

@Injectable()
export class ResourceService {
  constructor(
    private readonly listingService: ListingService,
    private readonly placeService: PlaceService,
    private readonly commentService: CommentService,
    private readonly reviewService: ReviewService,
  ) {}

  async findOneMeta(
    resourceType: ResourceType,
    id: string,
  ): Promise<ResourceContent | null> {
    switch (resourceType) {
      case 'listing':
        return this.listingService.findOneMeta(id);
      case 'place':
        return this.placeService.findOneMeta(id);
      case 'review':
        return this.reviewService.findOneMeta(id);
      // Add other cases as necessary
      default:
        throw new NotFoundException(
          `Resource of type ${resourceType} not found.`,
        );
    }
  }
}
