import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UndenegasestiComponent } from './undenegasesti.component';

describe('UndenegasestiComponent', () => {
  let component: UndenegasestiComponent;
  let fixture: ComponentFixture<UndenegasestiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UndenegasestiComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UndenegasestiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
