import { USER } from './userModel';

export interface APIRESP {
  status: string;
  message: string;
  error: any;
  data: USER | { name: string; img: string; status: boolean }[] | [];
}
