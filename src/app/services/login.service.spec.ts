import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs';
import { LoginRequest } from '../model/login.model';

import { LoginService } from './login.service';

describe('LoginService', () => {
  let service: LoginService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(LoginService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get single user observable', inject(
    [HttpTestingController],
    (http: HttpTestingController) => {
      const data = {
        email: 'user@mail.com',
        password: '12345',
      } as LoginRequest;
      const reqLogin = service.login(data);
      expect(reqLogin instanceof Observable).toBeTruthy();
      reqLogin.subscribe((res) => {
        expect(typeof res).toBe('object');
      });

      const p = http.expectOne('https://reqres.in/api/login');
      expect(p.request.body.email).toBeDefined();
      expect(p.request.body.password).toBeDefined();
      expect(p.request.method).toBe('POST');
      p.flush({});
    }
  ));
});
