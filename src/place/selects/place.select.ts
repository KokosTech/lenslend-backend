import { Prisma } from '@prisma/client';
import { createSelect } from '../../common/utils/createSelect';
import { CardUserSelect } from '../../listing/selects/listing.select';
import { ReviewSelect } from '../review/selects/review.select';
import { PlaceCategorySelect } from '../../category/selects/place-category.select';
import { ServiceSelect } from '../service/selects/service.select';

export const PlaceImageSelect = createSelect<Prisma.PlaceImageSelect>({
  uuid: true,
  url: true,
  alt: true,
  status: true,
});

export const PlaceServiceSelect = createSelect<Prisma.PlaceServiceSelect>({
  uuid: true,
  service: {
    select: ServiceSelect,
  },
});

export const PlaceTagSelect = createSelect<Prisma.PlaceTagSelect>({
  tag: {
    select: {
      uuid: true,
      name: true,
    },
  },
});

export const PlaceVisitorSelect = createSelect<Prisma.PlaceVisitorSelect>({
  uuid: true,
  created_at: true,
  user: {
    select: CardUserSelect,
  },
});

export const PlaceSelect = createSelect<Prisma.PlaceSelect>({
  uuid: true,
  name: true,
  icon: true,
  description: true,
  category: {
    select: PlaceCategorySelect,
  },
  lng: true,
  lat: true,
  images: {
    select: PlaceImageSelect,
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
          {
            deleted_at: {
              not: null,
            },
          },
        ],
      },
    },
  },
  services: {
    select: PlaceServiceSelect,
    where: {
      service: {
        status: 'PUBLIC',
        deleted_at: null,
      },
    },
  },
  tags: {
    select: PlaceTagSelect,
    where: {
      tag: {
        status: 'PUBLIC',
        deleted_at: null,
      },
    },
  },
  visitors: {
    select: PlaceVisitorSelect,
    where: {
      user: {
        deleted_at: null,
      },
    },
    orderBy: {
      created_at: 'desc',
    },
    take: 3,
  },
  reviews: {
    select: ReviewSelect,
    where: {
      status: 'PUBLIC',
      deleted_at: null,
    },
    orderBy: {
      created_at: 'desc',
    },
    take: 3,
  },
  status: true,
  creator: {
    select: CardUserSelect,
  },
  owner: {
    select: CardUserSelect,
  },
  created_at: true,
  updated_at: true,
});
