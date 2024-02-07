export interface PaginationParams {
  page: number;
  limit: number;
  sortBy: string; // e.g., "createdAt:ASC"
}

export const parseSortBy = (
  sortBy: string,
): { field: string; order: 'asc' | 'desc' } => {
  const [field, order] = sortBy.split(':');

  return {
    field,
    order: order.toLowerCase() as 'asc' | 'desc',
  };
};

export const calculateMeta = (
  totalItems: number,
  { page, limit, sortBy }: PaginationParams,
) => {
  const totalPages = Math.ceil(totalItems / limit);

  return {
    itemsPerPage: limit,
    totalItems,
    currentPage: page,
    totalPages,
    sortBy: [
      parseSortBy(sortBy).field,
      parseSortBy(sortBy).order.toUpperCase(),
    ],
  };
};
