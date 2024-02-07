export const roundRating = (rating: number | null): number => {
  if (!rating) {
    return 0;
  }

  return Math.round(rating * 10) / 10;
};
