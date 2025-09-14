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
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, MatSelectModule, MatProgressSpinnerModule, MatTooltip, MatFormField, MatInput, MatError, MatLabel, FlexLayoutModule, CommonModule, MatIcon, MatButtonModule, MatSuffix, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Login {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) { }

  loginForm!: FormGroup;

  passShow: Boolean = false;

  role!: string | null;

  loader: boolean = false;

  tenantId!: string | null;

  roleArray: any[] = [
    { name: 'Admin', value: 'admin' },
    { name: 'Manager', value: 'manager' },
    { name: 'Viewer', value: 'viewer' }
  ];

  subscriptionObj: Subscription = new Subscription();

  /**
   * On init life cycle hook
   */
  ngOnInit(): void {
    this.loginForm = new FormGroup(
      {
        email: new FormControl(null, [Validators.email, Validators.required]),
        password: new FormControl(null, Validators.required),
        role: new FormControl(null, Validators.required),
        tenantId: new FormControl(null)
      }
    )
    this.tenantId = this.route.snapshot.paramMap.get('tenantId');
    this.loginForm.get('tenantId')?.setValue(this.tenantId);
    this.setQueryDetails();
  }

  /**
   * Button event handler for showing password
   * @param event button event
   */
  showPassword(event: Event) {
    event.stopPropagation();
    if (this.passShow) {
      this.passShow = false
    }
    else this.passShow = true
  }

  /**
   * Function used to login
   */
  login(): void {
    if (this.loginForm.valid) {
      const loginCredentials = this.loginForm.value;
      this.loader = true;
      this.subscriptionObj.add(this.userService.loginUser(loginCredentials).subscribe({
        next: (res: any) => {
          // console.log(res);
          if (res) {
            const userDetails = res.data.userData;
            localStorage.setItem('token', userDetails.token);
            localStorage.setItem('userId', userDetails._id);
            this.router.navigate([`${this.tenantId}/dashboard/${userDetails._id}`], { queryParams: { role: userDetails.role.name }, replaceUrl: true })
            this.loader = false;
          }
        },
        error: (err: any) => {
          console.log(err)
          if (err.error.error) {
            this.snackBar.open(err.error.error.error, 'Ok', { duration: 4000 })
          }
          this.loader = false;
          this.cdr.detectChanges();
        }
      }));
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  /**
   * Navigation for home
   */
  navigateToHome(): void {
    this.router.navigate(['/home'])
  }

  /**
   * Function used to set queryparams for route
   */
  setQueryDetails(): void {
    const email = this.route.snapshot.queryParamMap.get('email');
    const role = this.route.snapshot.queryParamMap.get('role');

    if (email && role) {
      this.loginForm.get('email')?.setValue(email);
      this.loginForm.get('role')?.setValue(role);
    }
  }

  /**
   * on destroy life cycle hook
   */
  ngOnDestroy(): void {
    this.subscriptionObj.unsubscribe();
  }
}
