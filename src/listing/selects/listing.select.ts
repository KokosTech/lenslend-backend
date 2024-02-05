import { createSelect } from '../../common/utils/createSelect';
import { Prisma } from '@prisma/client';

export const CategorySelect = createSelect<Prisma.CategorySelect>({
  uuid: true,
  name: true,
});

export const ListingImageSelect = createSelect<Prisma.ListingImageSelect>({
  uuid: true,
  url: true,
  alt: true,
  status: true,
});

export const UserSelect = createSelect<Prisma.UserSelect>({
  uuid: true,
  name: true,
  username: true,
  phone: true,
  bio: true,
  profile_pic: true,
  header_pic: true,
});

export const ShortUserSelect = createSelect<Prisma.UserSelect>({
  uuid: true,
  name: true,
  username: true,
  phone: true,
});

export const ListingTagSelect = createSelect<Prisma.ListingTagSelect>({
  tag: {
    select: {
      uuid: true,
      name: true,
      status: true,
    },
  },
});

export const ListingSelect = createSelect<Prisma.ListingSelect>({
  uuid: true,
  title: true,
  description: true,
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
  images: {
    select: ListingImageSelect,
    orderBy: {
      order: 'asc',
    },
    where: {
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
  user: {
    select: UserSelect,
  },
  tags: {
    select: ListingTagSelect,
    where: {
      tag: {
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
  },
  created_at: true,
  updated_at: true,
});
