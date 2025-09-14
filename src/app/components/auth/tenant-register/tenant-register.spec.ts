import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TenantRegister } from './tenant-register';

describe('TenantRegister', () => {
  let component: TenantRegister;
  let fixture: ComponentFixture<TenantRegister>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TenantRegister]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TenantRegister);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
