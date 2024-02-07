import { createSelect } from '../../../common/utils/createSelect';
import { Prisma } from '@prisma/client';

export const ReviewSelect = createSelect<Prisma.PlaceReviewSelect>({
  uuid: true,
  rating: true,
  content: true,
  created_at: true,
  updated_at: true,
  user: {
    select: {
      uuid: true,
      name: true,
      username: true,
      profile_pic: true,
    },
  },
});
