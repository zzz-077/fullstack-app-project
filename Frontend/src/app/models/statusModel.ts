import { USER } from './userModel';

export interface APIRESP {
  status: string;
  message: string;
  error: any;
  data: any;
}
