import { Status } from '@prisma/client';

export type ResourceType = 'listing' | 'place' | 'comment' | 'review';
export type ResourceContent = {
  uuid: string;
  ownerId: string;
  status: Status;
};
