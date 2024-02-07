import { createSelect } from '../../common/utils/createSelect';
import { Prisma } from '@prisma/client';

export const PlaceCategorySelect = createSelect<Prisma.PlaceCategorySelect>({
  uuid: true,
  name: true,
});

const _ExpandedPlaceCategorySelect = createSelect<Prisma.PlaceCategorySelect>({
  uuid: true,
  name: true,
  sub_categories: {
    select: {
      uuid: true,
      name: true,
    },
  },
});

export const ExpandedPlaceCategorySelect =
  createSelect<Prisma.PlaceCategorySelect>({
    uuid: true,
    name: true,
    sub_categories: {
      select: _ExpandedPlaceCategorySelect,
    },
  });
