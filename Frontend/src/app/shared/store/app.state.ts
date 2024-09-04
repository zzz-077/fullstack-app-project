import { userState } from './userData/userData.reducers';
import { chatState } from './Chat/chat.reducers';

export interface AppState {
  user: userState;
  chat: chatState;
}
