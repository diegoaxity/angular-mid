import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { RouterTestingModule } from '@angular/router/testing';
import {
  TranslateFakeLoader,
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';
import { of } from 'rxjs';
import { UserResponse } from 'src/app/model/user.model';
import { UserService } from 'src/app/services/user.service';

import { UsersComponent } from './users.component';

describe('UsersComponent', () => {
  let component: UsersComponent;
  let fixture: ComponentFixture<UsersComponent>;

  beforeEach(async () => {
    let userSvcSpy = jasmine.createSpyObj('UserService', ['getUsers']);
    userSvcSpy.getUsers.and.callFake(() => {
      const res = {
        data: [],
      } as UserResponse;
      return of(res);
    });

    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        MatTableModule,
        MatButtonModule,
        MatIconModule,
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: TranslateFakeLoader },
        }),
      ],
      declarations: [UsersComponent],
      providers: [{ provide: UserService, useValue: userSvcSpy }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
