import { Prisma } from '@prisma/client';

export type CheckSelectKeys<T, U> = {
  [K in keyof T]: K extends keyof U ? T[K] : never;
};

export const createSelect = <T extends Prisma.SelectSubset<unknown, unknown>>(
  arg: CheckSelectKeys<T, T>,
) => arg;
