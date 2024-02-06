import { createSelect } from '../../common/utils/createSelect';
import { Prisma } from '@prisma/client';
import { PlaceImageSelect } from './place.select';

export const CardPlaceSelect = createSelect<Prisma.PlaceSelect>({
  uuid: true,
  name: true,
  icon: true,
  lat: true,
  lng: true,
  images: {
    select: PlaceImageSelect,
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
});
