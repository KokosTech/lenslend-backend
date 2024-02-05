export type Review = {
  uuid: string;
  content: string;
  rating: number;
  created_at: Date;
  updated_at: Date;
  user: {
    uuid: string;
    name: string;
    username: string;
    profile_pic?: string;
  };
};
