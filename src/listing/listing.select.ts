export const ListingSelect = {
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
    select: {
      uuid: true,
      name: true,
    },
  },
  images: {
    select: {
      uuid: true,
      url: true,
      alt: true,
      status: true,
    },
  },
  user: {
    select: {
      uuid: true,
      name: true,
      username: true,
      phone: true,
      bio: true,
      profile_pic: true,
      header_pic: true,
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
  ratings: {
    select: {
      rating: true,
    },
  },
  created_at: true,
  updated_at: true,
};

export const ShortListingSelect = {
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
    select: {
      uuid: true,
      name: true,
    },
  },
  user: {
    select: {
      uuid: true,
      name: true,
      username: true,
      phone: true,
    },
  },
  images: {
    select: {
      uuid: true,
      url: true,
      alt: true,
      status: true,
    },
    where: {
      order: 1,
    },
  },
  created_at: true,
  updated_at: true,
};
