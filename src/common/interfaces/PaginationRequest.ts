export interface PaginationRequest extends Request {
  query: {
    page: string;
    limit: string;
  };
}
