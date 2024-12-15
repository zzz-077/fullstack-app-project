import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { RegistrationService } from '../registrationService/registration.service';
import { Observable, catchError, map, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthGuardService implements CanActivate {
  constructor(
    private registrationS: RegistrationService,
    private router: Router
  ) {}

  canActivate(): Observable<boolean> {
    return this.registrationS.homeAutentication().pipe(
      map((response) => {
        if (response) {
          return true;
        } else {
          this.router.navigate(['/signin']);
          return false;
        }
      }),
      catchError(() => {
        this.router.navigate(['/signin']);
        return of(false);
      })
    );
  }
}
