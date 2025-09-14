import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class PasswordValidatorService {
  passwordMatchValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const password = control.get('password');
      const confirmPassword = control.get('confirmPassword');

      if (password && password.valid && confirmPassword && confirmPassword.value && password.value !== confirmPassword.value) {
        // Password and confirm password do not match, return an error
        confirmPassword.setErrors({ passwordMismatch: true })
        // return { passwordMismatch: true };
      }
      // Passwords match, return null (no error)
      return null;
    };
  }
}
