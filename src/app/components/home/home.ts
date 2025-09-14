import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { FlexLayoutModule } from 'ngx-flexible-layout';
import { Route, Router } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TenantConfirmation } from '../dialog-components/tenant-confirmation/tenant-confirmation';
import { DEFULT_TENANT_ID } from '../../constants/constant';



@Component({
  selector: 'app-home',
  imports: [MatCardModule, MatButtonModule, MatIcon, FlexLayoutModule, MatDialogModule],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home {

  selectedTenantId!: string;

  constructor(private router: Router, private dialog: MatDialog) {

  }

  navigateToLogin(role: string) {
    if (role == 'login') {
      const dialogRef = this.dialog.open(TenantConfirmation, {
        width: '400px',
        height: '250px',
        data: { defaultTenantId: DEFULT_TENANT_ID }
      });
      dialogRef.afterClosed().subscribe(result => {
        this.selectedTenantId = result;
        if (this.selectedTenantId) {
          this.router.navigate([`auth/${this.selectedTenantId}/${role}`])
        }
      });
    }
    else {
      this.router.navigate([`auth/${role}`])
    }
  }
}
