export interface USER {
  name: string;
  email: string;
  password: string;
  img: string;
  friends: string[];
  friendRequests: { _id: string; username: string }[];
}
