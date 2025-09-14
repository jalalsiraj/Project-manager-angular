import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TenantConfirmation } from './tenant-confirmation';

describe('TenantConfirmation', () => {
  let component: TenantConfirmation;
  let fixture: ComponentFixture<TenantConfirmation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TenantConfirmation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TenantConfirmation);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
