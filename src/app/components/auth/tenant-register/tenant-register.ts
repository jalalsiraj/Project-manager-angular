import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatError, MatFormField, MatLabel, MatSuffix } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltip } from '@angular/material/tooltip';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FlexLayoutModule } from 'ngx-flexible-layout';
// import { UserService } from '../../../services/user-service';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-tenant-register',
  imports: [ReactiveFormsModule, MatProgressSpinnerModule, MatTooltip, MatFormField, MatInput, MatError, MatLabel, FlexLayoutModule, CommonModule, MatIcon, MatButtonModule, MatSuffix],
  templateUrl: './tenant-register.html',
  styleUrl: './tenant-register.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})


export class TenantRegister {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {

  }

  tenantRegisterForm!: FormGroup;

  passShow: Boolean = false;

  role!: string | null;

  loader: boolean = false;

  subscriptionObj: Subscription = new Subscription();

  ngOnInit() {
    this.tenantRegisterForm = new FormGroup(
      {
        name: new FormControl(null, Validators.required),
        email: new FormControl(null, [Validators.email, Validators.required]),
        password: new FormControl(null, [Validators.required, Validators.minLength(6)]),
        role: new FormControl(null)
      }
    )
    this.role = 'admin'
    this.tenantRegisterForm.get('role')?.setValue(this.role);
  }

  showPassword(event: Event) {
    event.stopPropagation();
    if (this.passShow) {
      this.passShow = false
    }
    else this.passShow = true
  }

  register() {
    if (this.tenantRegisterForm.valid) {
      const registerData = this.tenantRegisterForm.value;
      this.loader = true;
      this.subscriptionObj.add(this.userService.registerTenant(registerData).subscribe({
        next: (res: any) => {
          console.log(res);
          if (res) {
            const userDetails = res.data?.registeredTenant;
            console.log(userDetails);
            this.router.navigate([`/auth/${userDetails.tenantId}/login`], { queryParams: { email: userDetails.email, role: this.role }, replaceUrl: true })
            this.loader = false;
            this.snackBar.open("Tenant registered successfully", 'Ok', { duration: 4000 })
          }
        },
        error: (err: any) => {
          if (err.error.error.code == 11000) {
            this.snackBar.open("User already exists", 'Ok', { duration: 4000 })
          }
          this.loader = false;
          this.cdr.detectChanges();
        }
      }));
    } else {
      this.tenantRegisterForm.markAllAsTouched();
    }
  }

  navigateToHome() {
    this.router.navigate(['/home'])
  }
}
