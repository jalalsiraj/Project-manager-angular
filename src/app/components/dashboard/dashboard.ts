import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ActivatedRoute, Router } from '@angular/router';
import { FlexLayoutModule } from 'ngx-flexible-layout';
import { Subscription } from 'rxjs';
import { ProjectsService } from '../../services/projects.service';
import { UserService } from '../../services/user.service';
import { MatDialog } from '@angular/material/dialog';
import { Confirmation } from '../dialog-components/confirmation/confirmation';
import { EditProject } from '../dialog-components/edit-project/edit-project';
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-dashboard',
  imports: [
    FlexLayoutModule,
    MatToolbarModule,
    MatSidenavModule,
    MatButtonModule,
    MatCardModule,
    CommonModule,
    MatPaginator,
    MatPaginatorModule,
    MatTableModule,
    MatIcon,
    MatProgressSpinnerModule
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard {

  projects!: any[];

  tenantId!: string | null;

  userId!: string | null;

  role!: string | null;

  subscriptionObj: Subscription = new Subscription();

  displayedColumns: string[] = ['name', 'description', 'manager', 'actions'];

  dataSource = new MatTableDataSource<any>(this.projects);

  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;

  isLoader: boolean = false;

  permissions: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private projectService: ProjectsService,
    private cdr: ChangeDetectorRef,
    private userService: UserService,
    private dialog: MatDialog,
    private router: Router,
    private snackBar: MatSnackBar
  ) {

  }

  /**
   * On init life cycle hook
   */
  ngOnInit() {
    this.userId = this.route.snapshot.paramMap.get('id');
    this.tenantId = this.route.snapshot.paramMap.get('tenantId');
    this.role = this.route.snapshot.queryParamMap.get('role');
    this.getUserDetails();
    this.getAllProjects();
  }

  /**
   * Function used for loading paginator
   */
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  /**
   * Function used to load user details and permissionss
   */
  getUserDetails(): void {
    this.subscriptionObj.add(this.userService.getUserDetails({ id: this.userId, tenantId: this.tenantId }).subscribe({
      next: (res: any) => {
        this.permissions = res?.data?.userDetails?.role?.permissions?.length ? res?.data?.userDetails?.role?.permissions : [];
      },
      error: (err: any) => {
        if (err) {
          console.log("Error while getting user Details", err);
        }
      }
    }))
  }

  /**
   * Function used to load project list
   */
  getAllProjects(): void {
    this.isLoader = true;
    this.subscriptionObj.add(this.projectService.loadProjects({ tenantId: this.tenantId }).subscribe({
      next: (res: any) => {
        if (res) {
          this.projects = res.data?.length ? res.data : [];
          // console.log(this.projects);
          this.cdr.detectChanges();
          this.isLoader = false;
        }
      },
      error: (err: any) => {
        console.log(err);
        this.snackBar.open('Failed to load Projects list', 'Ok', { duration: 3000 })
        this.isLoader = false;
      }
    }))
  }

  /**
   * Function used to delete a project data
   * @param projectData holds a project's data
   */
  onDelete(projectData: any) {
    if (projectData) {
      const dialogRef = this.dialog.open(Confirmation, {
        data: { message: "Are you sure want to delete the project?" },
        width: '350px'
      });
      dialogRef.afterClosed().subscribe(
        (res) => {
          if (res) {
            this.isLoader = true;
            this.subscriptionObj.add(this.projectService.deleteProject(projectData).subscribe({
              next: (res: any) => {
                this.cdr.detectChanges();
                this.isLoader = false;
                this.getAllProjects();
              },
              error: (err: any) => {
                this.isLoader = false;
              }
            }))
          }
        }
      )
    }
  }

  /**
   * Function used to Edit a Project's data
   * @param projectData holds a projects data
   */
  onEdit(projectData: any) {
    if (projectData) {
      const dialogData = {
        projectData,
        permissions: this.permissions,
        tenantId: this.tenantId,
        action: 'edit'
      }
      const dialogRef = this.dialog.open(EditProject, {
        width: '500px',
        data: dialogData
      });
      dialogRef.afterClosed().subscribe((res) => {
        if (res) {
          this.getAllProjects();
        }
      });
    }
  }

  /**
   * Function used to view a project data
   * @param projectData holds a projects data
   */
  onView(projectData: any): void {
    if (projectData) {
      const dialogData = {
        projectData,
        permissions: this.permissions,
        action: 'view',
        tenantId: this.tenantId
      }
      const dialogRef = this.dialog.open(EditProject, {
        width: '500px',
        data: dialogData
      });
    }
  }

  /**
   * Function used to create a project
   */
  addProject() {
    const dialogData = {
      action: 'create',
      tenantId: this.tenantId
    }
    const dialogRef = this.dialog.open(EditProject, {
      width: '500px',
      data: dialogData
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.getAllProjects();
      }
    });
  }

  /**
   * Function used to logout a user
   */
  logout(): void {
    const dialogRef = this.dialog.open(Confirmation, {
      width: '350px',
      data: { message: 'Are you sure you want to Logout?' },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        localStorage.clear();
        this.router.navigate(['/home'])
      }
    });
  }

  /**
   * Function used to clean up the subscriptions
   */
  ngOnDestroy() {
    this.subscriptionObj.unsubscribe();
  }

}
