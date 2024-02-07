import { Prisma } from '@prisma/client';
import { createSelect } from '../../../common/utils/createSelect';

export const ServiceSelect = createSelect<Prisma.ServiceSelect>({
  uuid: true,
  name: true,
  icon: true,
});
