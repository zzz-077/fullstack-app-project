export interface FRIENDADD {
  userId: string;
  userName: string;
  userImg: string;
  friendName: string;
}
export interface USERADDRESP {
  userId: string;
  requesterName: string;
  requesterId: string;
  status: 'accept' | 'reject';
}
