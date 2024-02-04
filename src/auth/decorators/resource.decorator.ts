import { SetMetadata } from '@nestjs/common';

export const Resource = (
  ...args: ('listing' | 'place' | 'comment' | 'review')[]
) => SetMetadata('resource', args);
