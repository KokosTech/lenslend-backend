import { createSelect } from '../../../common/utils/createSelect';
import { Prisma } from '@prisma/client';
import { CardUserSelect } from '../../selects/listing.select';

export const CommentSelect = createSelect<Prisma.ListingCommentSelect>({
  uuid: true,
  content: true,
  user: {
    select: CardUserSelect,
  },
  created_at: true,
  updated_at: true,
});
