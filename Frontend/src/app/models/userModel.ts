export interface USER {
  name: string;
  email: string;
  password: string;
  img: string;
  friends: string[];
  status: boolean;
  friendRequests: { _id: string; username: string; img: string }[];
}
