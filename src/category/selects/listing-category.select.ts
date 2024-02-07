import { createSelect } from '../../common/utils/createSelect';
import { Prisma } from '@prisma/client';

export const CategorySelect = createSelect<Prisma.CategorySelect>({
  uuid: true,
  name: true,
});

const _ExpandedCategorySelect = createSelect<Prisma.CategorySelect>({
  uuid: true,
  name: true,
  sub_categories: {
    select: {
      uuid: true,
      name: true,
    },
  },
});

export const ExpandedCategorySelect = createSelect<Prisma.CategorySelect>({
  uuid: true,
  name: true,
  sub_categories: {
    select: _ExpandedCategorySelect,
  },
});
