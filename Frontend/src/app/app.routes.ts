import { Routes } from '@angular/router';
import { RegistrationComponent } from './components/pages/signup/signup.component';
import { SigninComponent } from './components/pages/signin/signin.component';
import { UndefinedPageComponent } from './components/pages/undefined-page/undefinedPage.component';
import { MainComponent } from './components/pages/main/main.component';

export const routes: Routes = [
  { path: 'home', component: MainComponent },
  { path: 'signup', component: RegistrationComponent },
  { path: 'signin', component: SigninComponent },
  { path: '**', component: UndefinedPageComponent },
];
