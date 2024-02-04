import { Prisma } from '@prisma/client';

type CheckSelectKeys<T, U> = {
  [K in keyof T]: K extends keyof U ? T[K] : never;
};

const createSelect = <T extends Prisma.SelectSubset<unknown, unknown>>(
  arg: CheckSelectKeys<T, T>,
) => arg;

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

export const ShortPlaceSelect = createSelect<Prisma.PlaceSelect>({
  uuid: true,
  name: true,
  icon: true,
  lng: true,
  lat: true,
});

export const CardPlaceSelect = createSelect<Prisma.PlaceSelect>({
  uuid: true,
  name: true,
  icon: true,
  lng: true,
  lat: true,
  images: {
    select: {
      uuid: true,
      url: true,
      alt: true,
    },
    where: {
      order: 1,
    },
  },
});

export const PlaceSelect = createSelect<Prisma.PlaceSelect>({
  uuid: true,
  name: true,
  icon: true,
  description: true,
  category: {
    select: {
      uuid: true,
      name: true,
    },
  },
  lng: true,
  lat: true,
  images: {
    select: {
      uuid: true,
      url: true,
      alt: true,
    },
    orderBy: {
      order: 'asc',
    },
  },
  services: {
    select: {
      service: {
        select: {
          uuid: true,
          name: true,
          icon: true,
        },
      },
    },
  },
  tags: {
    select: {
      tag: {
        select: {
          uuid: true,
          name: true,
        },
      },
    },
  },
  visitors: {
    select: {
      uuid: true,
      created_at: true,
      user: {
        select: {
          uuid: true,
          name: true,
          username: true,
          bio: true,
          phone: true,
          profile_pic: true,
          header_pic: true,
        },
      },
    },
    orderBy: {
      created_at: 'desc',
    },
    take: 3,
  },
  reviews: {
    select: ReviewSelect,
    orderBy: {
      created_at: 'desc',
    },
    take: 3,
  },
  status: true,
  creator: {
    select: {
      uuid: true,
      name: true,
      username: true,
      profile_pic: true,
      header_pic: true,
    },
  },
  owner: {
    select: {
      uuid: true,
      name: true,
      username: true,
      profile_pic: true,
      header_pic: true,
    },
  },
  created_at: true,
  updated_at: true,
});
