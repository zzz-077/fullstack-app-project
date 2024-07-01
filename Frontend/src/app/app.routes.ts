import { Routes } from '@angular/router';
import { RegistrationComponent } from './components/pages/signup/signup.component';
import { SigninComponent } from './components/pages/signin/signin.component';
import { UndefinedPageComponent } from './components/pages/undefined-page/undefinedPage.component';
import { AppComponent } from './app.component';

export const routes: Routes = [
  { path: '', component: AppComponent },
  { path: 'signup', component: RegistrationComponent },
  { path: 'signIn', component: SigninComponent },
  { path: '**', component: UndefinedPageComponent },
];
