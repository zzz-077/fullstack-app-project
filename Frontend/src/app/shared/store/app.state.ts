import { userState } from './userData/userData.reducers';
import { chatState } from './Chat/chat.reducers';
import { AllchatState } from './AllChat/chats.reducers';

export interface AppState {
  user: userState;
  chat: chatState;
  AllUserChats: AllchatState;
}
