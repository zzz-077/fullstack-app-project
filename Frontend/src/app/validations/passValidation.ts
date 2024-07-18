import { AbstractControl, ValidationErrors, FormGroup } from '@angular/forms';

export function passwordMatch(): (
  control: AbstractControl
) => ValidationErrors | null {
  return (control: AbstractControl): ValidationErrors | null => {
    const password = control.parent?.get('password')?.value;
    const confirmPassword = control.value;
    if (password !== confirmPassword) {
      return { passwordMismatch: true };
    }
    return null;
  };
}
