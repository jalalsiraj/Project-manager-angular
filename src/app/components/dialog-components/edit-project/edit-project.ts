import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogContent, MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from "@angular/material/input";
import { FlexLayoutModule } from 'ngx-flexible-layout';
import { MatSelectModule } from "@angular/material/select";
import { Subscription } from 'rxjs';
import { ProjectsService } from '../../../services/projects.service';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-edit-project',
  imports: [MatDialogContent, MatDialogModule, FlexLayoutModule, ReactiveFormsModule, MatInputModule, MatButtonModule, CommonModule, MatSelectModule],
  templateUrl: './edit-project.html',
  styleUrl: './edit-project.scss'
})
export class EditProject {

  projectForm!: FormGroup;

  header: string = '';

  managersList: any[] = [];

  subscriptionObj: Subscription = new Subscription();

  constructor(
    public dialogRef: MatDialogRef<EditProject>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private projectService: ProjectsService,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.projectForm = new FormGroup({
      name: new FormControl(null, Validators.required),
      description: new FormControl(null, Validators.maxLength(200)),
      managerId: new FormControl(null, Validators.required),
      tenantId: new FormControl(null)
    });
    if (this.data) {
      if (this.data.projectData) {
        console.log(this.data.projectData)
        this.projectForm.setValue({
          name: this.data.projectData.name,
          description: this.data.projectData.description,
          managerId: this.data.projectData.managerId._id,
          tenantId: this.data.projectData.tenantId
        })
      }
      if (this.data.action == 'create' && this.data.tenantId) {
        this.projectForm.get('tenantId')?.setValue(this.data.tenantId)
      }
      switch (this.data.action) {
        case 'view':
        case 'edit':
          this.header = this.data.projectData.name;
          break;
        case 'create':
          this.header = "Create Project";
          break;
        default:
          this.header = "Project Details";
      }
      if (this.data?.permissions) {
        if (!(this.data.permissions.includes('create') || this.data.permissions.includes('update'))) {
          this.projectForm.disable();
        }
      }
      if (this.data?.action == 'view') {
        this.projectForm.disable();
      }
      this.getAllManagers();
    }
  }

  getAllManagers(): void {
    if (this.data.tenantId) {
      console.log(this.data.tenantId);
      this.subscriptionObj.add(this.userService.getAllManagers(this.data.tenantId).subscribe({
        next: (res) => {
          if (res) {
            this.managersList = res.data?.managersList;
          }
        },
        error: (err) => {
          if (err) {
            console.log("Error while loading managers list", err);
          }
        }
      }))
    }
  }

  onSave() {
    if (this.projectForm.valid) {
      if (this.data.action == 'edit' && this.data.projectData) {
        const updateData = {
          ...{ _id: this.data.projectData._id },
          ...this.projectForm.value
        }
        this.subscriptionObj.add(this.projectService.updateProject(updateData).subscribe({
          next: (res) => {
            if (res) {
              this.dialogRef.close(true);
            }
          },
          error: (err) => {
            console.log(err);
          }
        }))
      }
      else {
        this.subscriptionObj.add(this.projectService.createProject(this.projectForm.value).subscribe({
          next: (res) => {
            console.log(res);
            if (res) {
              this.dialogRef.close(true);
            }
          },
          error: (err) => {
            console.log(err);
          }
        }))
      }
    }

  }

  onClose(): void {
    this.dialogRef.close(false);
  }

}
