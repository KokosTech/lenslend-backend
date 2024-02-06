import { createSelect } from '../../common/utils/createSelect';
import { Prisma } from '@prisma/client';
import {
  CategorySelect,
  ListingImageSelect,
  ShortUserSelect,
} from './listing.select';

export const ShortListingSelect = createSelect<Prisma.ListingSelect>({
  uuid: true,
  title: true,
  lat: true,
  lng: true,
  type: true,
  price: true,
  state: true,
  rental: true,
  negotiable: true,
  status: true,
  category: {
    select: CategorySelect,
  },
  user: {
    select: ShortUserSelect,
  },
  images: {
    select: ListingImageSelect,
    where: {
      order: 1,
      deleted_at: null,
      NOT: {
        OR: [
          {
            status: 'DELETED',
          },
          {
            status: 'REMOVED',
          },
        ],
      },
    },
  },
  created_at: true,
  updated_at: true,
});
