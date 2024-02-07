import { createSelect } from '../../common/utils/createSelect';
import { Prisma } from '@prisma/client';

export const ShortPlaceSelect = createSelect<Prisma.PlaceSelect>({
  uuid: true,
  name: true,
  icon: true,
  lat: true,
  lng: true,
});
