import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import {
  TranslateFakeLoader,
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';
import { of, Subject, throwError } from 'rxjs';
import { User, UserResponse } from 'src/app/model/user.model';
import { DataService } from 'src/app/services/data.service';
import { UserService } from 'src/app/services/user.service';

import { UsersComponent } from './users.component';

describe('UsersComponent', () => {
  let component: UsersComponent;
  let fixture: ComponentFixture<UsersComponent>;
  let userSvcSpy: any;
  let dataSvcSpy: any;

  beforeEach(async () => {
    userSvcSpy = jasmine.createSpyObj('UserService', ['getUsers']);
    userSvcSpy.getUsers.and.callFake(() => {
      const res = {
        data: [],
      } as UserResponse;
      return of(res);
    });
    dataSvcSpy = jasmine.createSpyObj('DataService', ['isLoading', 'message']);
    dataSvcSpy.isLoading = new Subject<boolean>();
    dataSvcSpy.message = new Subject<string>();

    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
          {
            path: 'user:/id',
            redirectTo: '',
          },
        ]),
        MatTableModule,
        MatButtonModule,
        MatIconModule,
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: TranslateFakeLoader },
        }),
      ],
      declarations: [UsersComponent],
      providers: [
        { provide: UserService, useValue: userSvcSpy },
        { provide: DataService, useValue: dataSvcSpy },
      ],
    }).compileComponents();
  });

  it('should create', () => {
    fixture = TestBed.createComponent(UsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should create with error', fakeAsync(() => {
    let spyLoading = spyOn(dataSvcSpy.isLoading, 'next');
    let spyMessage = spyOn(dataSvcSpy.message, 'next');
    userSvcSpy.getUsers.and.callFake(() => {
      return throwError('');
    });
    fixture = TestBed.createComponent(UsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(spyLoading).toHaveBeenCalledWith(true);
    tick();
    expect(spyLoading).toHaveBeenCalledWith(false);
    expect(spyMessage).toHaveBeenCalledWith('pages.users.errors.loading');
  }));

  it('should go to user', () => {
    const spyRouter = spyOn(Router.prototype, 'navigate');

    fixture = TestBed.createComponent(UsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const user = {
      id: 1,
    } as User;
    component.goToUser(user);
    expect(spyRouter).toHaveBeenCalledWith(['/user', user.id]);
  });
});
