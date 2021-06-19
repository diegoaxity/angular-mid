import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { LoginComponent } from './login.component';
import { RouterTestingModule } from '@angular/router/testing';
import {
  TranslateFakeLoader,
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Observable, of, Subject, throwError } from 'rxjs';
import { LoginService } from 'src/app/services/login.service';
import { DataService } from 'src/app/services/data.service';
import { StorageKeys } from 'src/app/constants/config';

const loginMock = require('../../../mocks/login.json');

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let dataSvcSpy: any;
  let loginSvcSpy: any;

  beforeEach(async () => {
    loginSvcSpy = jasmine.createSpyObj('LoginService', ['login']);
    dataSvcSpy = jasmine.createSpyObj('DataService', [
      'setToken',
      'isLoading',
      'message',
    ]);
    loginSvcSpy.login.and.callFake(() => {
      return of(loginMock);
    });
    dataSvcSpy.isLoading = jasmine.createSpyObj('', ['asObservable', 'next']);
    dataSvcSpy.isLoading.asObservable.and.callFake(() => {
      return of(true);
    });
    dataSvcSpy.message = jasmine.createSpyObj('', ['next']);

    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [
        ReactiveFormsModule,
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([{ path: 'users', redirectTo: '' }]),
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: TranslateFakeLoader },
        }),
        MatInputModule,
        MatButtonModule,
        BrowserAnimationsModule,
      ],
      providers: [
        { provide: LoginService, useValue: loginSvcSpy },
        { provide: DataService, useValue: dataSvcSpy },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should click login', () => {
    component.formLogin?.patchValue({
      username: 'test@mail.com',
      password: '12345',
    });
    component.loginClick();
    expect(dataSvcSpy.setToken).toHaveBeenCalledWith('QpwL5tke4Pnpja7X4');
  });

  it('should click login with error', () => {
    loginSvcSpy.login.and.callFake(() => {
      return throwError('error');
    });

    component.formLogin?.patchValue({
      username: 'test@mail.com',
      password: '12345',
    });
    component.loginClick();
    expect(dataSvcSpy.message.next).toHaveBeenCalled();
    expect(dataSvcSpy.isLoading.next).toHaveBeenCalled();
  });
});
