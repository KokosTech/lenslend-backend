export interface RequestWithTokenInterface extends Request {
  user: {
    id: string;
    tokenId: string;
  };
}
