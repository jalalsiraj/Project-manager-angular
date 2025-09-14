import { ChangeDetectionStrategy, ChangeDetectorRef, Component, SimpleChanges } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatDatepickerModule, MatDatepickerToggle } from '@angular/material/datepicker';
import { MatIcon } from '@angular/material/icon';
import { MatOption } from '@angular/material/autocomplete';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatInput } from '@angular/material/input';
import { FlexLayoutModule } from 'ngx-flexible-layout';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltip } from '@angular/material/tooltip';
import { PasswordValidatorService } from '../../../services/password-validator-service';
import { UserService } from '../../../services/user.service';


@Component({
  selector: 'app-register',
  imports: [
    // MatSnackBar
    MatError,
    ReactiveFormsModule,
    MatLabel,
    MatFormField,
    MatDatepickerModule,
    MatIcon,
    CommonModule,
    MatSelectModule,
    MatInput,
    FlexLayoutModule,
    MatButtonModule,
    RouterLink,
    MatProgressSpinnerModule,
    MatTooltip
  ],
  templateUrl: './register.html',
  styleUrl: './register.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Register {

  roleArray: any[] = [
    { name: 'Manager', value: 'manager' },
    { name: 'Viewer', value: 'viewer' }
  ];

  todayDate: Date = new Date();

  registrationForm!: FormGroup;

  passShow: boolean = false;

  tenantId!: string | null;

  confirmPassShow: boolean = false;

  role?: string | null;

  subscriptionObj: Subscription = new Subscription();

  loader: boolean = false;

  constructor(
    private passwordValidator: PasswordValidatorService,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private userService: UserService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }


  ngOnInit(): void {
    this.registrationForm = new FormGroup({
      name: new FormControl(null, [Validators.pattern('^[a-zA-Z ]*$'), Validators.required]),
      email: new FormControl(null, [Validators.email, Validators.required]),
      role: new FormControl(null, Validators.required),
      password: new FormControl(null, [Validators.required, Validators.minLength(6)]),
      confirmPassword: new FormControl(null, [Validators.required]),
      tenantId: new FormControl(null)
    }, {
      validators: this.passwordValidator.passwordMatchValidator()
    });

    this.tenantId = this.route.snapshot.paramMap.get('tenantId');
    if (this.tenantId) {
      this.registrationForm.get('tenantId')?.setValue(this.tenantId);
    }
  }

  registerSubmit(): void {
    if (this.registrationForm.valid) {
      const userData = this.registrationForm.value;
      this.loader = true;
      this.subscriptionObj.add(this.userService.registerUser(userData).subscribe({
        next: (res: any) => {
          this.loader = false;
          this.snackBar.open('User registered Successfully', 'Ok', { duration: 3000 });
          this.router.navigate([`/auth/${this.tenantId}/login`])
        },
        error: (err) => {
          this.loader = false;
          if (err.error.error.error.code == 11000) {
            this.snackBar.open('Email Already Exists !. Try again with another email', 'Ok', { duration: 3000 });
          } else {
            this.snackBar.open('Error while Signup ! Please try again later', 'Ok', { duration: 3000 });
          }
          this.cdr.detectChanges();
        }
      }))
    }
  }

  showPassword(event: Event): void {
    event.stopPropagation();
    if (this.passShow) {
      this.passShow = false
    }
    else this.passShow = true
  }

  showConfirmPassword(event: Event) {
    event.stopPropagation();
    if (this.confirmPassShow) {
      this.confirmPassShow = false
    }
    else this.confirmPassShow = true
  }

  navigateToHome() {
    this.router.navigate(['/home'])
  }

  ngOnDestroy() {
    this.subscriptionObj.unsubscribe();
  }
}

