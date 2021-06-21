import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, throwError } from 'rxjs';
import { DataService } from 'src/app/services/data.service';
import { UserService } from 'src/app/services/user.service';

import { UserComponent } from './user.component';

const userMock = require('../../../mocks/user.json');

describe('UserComponent', () => {
  let component: UserComponent;
  let fixture: ComponentFixture<UserComponent>;
  let userSvcSpy: any;
  let dataSvcSpy: any;

  beforeEach(async () => {
    userSvcSpy = jasmine.createSpyObj('UserService', ['getUser']);
    userSvcSpy.getUser.and.callFake(() => {
      return of(userMock);
    });
    dataSvcSpy = jasmine.createSpyObj('DataService', ['isLoading', 'message']);
    dataSvcSpy.isLoading = new Subject<boolean>();
    dataSvcSpy.message = new Subject<string>();

    await TestBed.configureTestingModule({
      declarations: [UserComponent],
      imports: [RouterTestingModule],
      providers: [
        { provide: UserService, useValue: userSvcSpy },
        { provide: DataService, useValue: dataSvcSpy },
        { provide: ActivatedRoute, useValue: { params: of({ id: 1 }) } },
      ],
    }).compileComponents();
  });

  it('should create', () => {
    fixture = TestBed.createComponent(UserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should create with params', fakeAsync(() => {
    let spyLoading = spyOn(dataSvcSpy.isLoading, 'next');
    TestBed.overrideProvider(ActivatedRoute, {
      useValue: { params: of({ id: 1 }) },
    });
    fixture = TestBed.createComponent(UserComponent);
    expect(spyLoading).toHaveBeenCalledWith(true);
    component = fixture.componentInstance;
    fixture.detectChanges();
    tick();
    expect(spyLoading).toHaveBeenCalledWith(false);
    expect(component.user).toEqual(userMock.data);
  }));

  it('should create without params', () => {
    let spyLoading = spyOn(dataSvcSpy.isLoading, 'next');
    let spyMessage = spyOn(dataSvcSpy.message, 'next');
    TestBed.overrideProvider(ActivatedRoute, { useValue: { params: of({}) } });
    fixture = TestBed.createComponent(UserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(spyLoading).not.toHaveBeenCalled();
    expect(spyMessage).not.toHaveBeenCalled();
    expect(userSvcSpy.getUser).not.toHaveBeenCalled();
  });

  it('should create with params and error', fakeAsync(() => {
    let spyLoading = spyOn(dataSvcSpy.isLoading, 'next');
    let spyMessage = spyOn(dataSvcSpy.message, 'next');
    userSvcSpy.getUser.and.callFake(() => {
      return throwError('user not found');
    });
    TestBed.overrideProvider(ActivatedRoute, {
      useValue: { params: of({ id: 1 }) },
    });
    fixture = TestBed.createComponent(UserComponent);
    expect(spyLoading).toHaveBeenCalledWith(true);
    component = fixture.componentInstance;
    fixture.detectChanges();
    tick();
    expect(spyLoading).toHaveBeenCalledWith(false);
    expect(spyMessage).toHaveBeenCalledWith('user not found');
    expect(component.user).toBeUndefined();
  }));
});
