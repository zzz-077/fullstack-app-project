import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { HttpClientModule, provideHttpClient } from '@angular/common/http';
import { provideState, provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { UserReducer } from './shared/store/userData/userData.reducers';
import { UserDataEffect } from './shared/store/userData/userData.effects';
import { ChatReducer } from './shared/store/Chat/chat.reducers';
import { ChatsForUserReducer } from './shared/store/AllChat/chats.reducers';
import { getUserChatsEffect } from './shared/store/AllChat/chats.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    provideHttpClient(),
    provideStore(),
    provideState({ name: 'user', reducer: UserReducer }),
    provideState({ name: 'chat', reducer: ChatReducer }),
    provideState({ name: 'AllUserChats', reducer: ChatsForUserReducer }),
    provideEffects(UserDataEffect, getUserChatsEffect),
  ],
};
