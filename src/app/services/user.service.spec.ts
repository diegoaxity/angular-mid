import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs';
import { UserResponse } from '../model/user.model';

import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(UserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get users observable', inject(
    [HttpTestingController],
    (http: HttpTestingController) => {
      const reqUsers = service.getUsers();
      expect(reqUsers instanceof Observable).toBeTruthy();
      reqUsers.subscribe((res) => {
        expect(typeof res).toBe('object');
      });

      const p = http.expectOne('https://reqres.in/api/users');
      expect(p.request.method).toBe('GET');
      p.flush({});
    }
  ));

  it('should get single user observable', inject(
    [HttpTestingController],
    (http: HttpTestingController) => {
      const reqUsers = service.getUser(1);
      expect(reqUsers instanceof Observable).toBeTruthy();
      reqUsers.subscribe((res) => {
        expect(typeof res).toBe('object');
      });

      const p = http.expectOne('https://reqres.in/api/users/1');
      expect(p.request.method).toBe('GET');
      p.flush({});
    }
  ));
});
