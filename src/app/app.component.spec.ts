import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import {
  TranslateFakeLoader,
  TranslateLoader,
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { AppComponent } from './app.component';
import { DataService } from './services/data.service';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let dataSvcSpy: any;
  let matSnackSpy: any;

  beforeEach(async () => {
    dataSvcSpy = jasmine.createSpyObj('DataService', ['isLoading', 'message']);
    matSnackSpy = jasmine.createSpyObj('MatSnackbar', ['open']);
    dataSvcSpy.isLoading = new Subject<boolean>();
    dataSvcSpy.message = new Subject<string>();

    await TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        RouterTestingModule,
        MatSnackBarModule,
        MatToolbarModule,
        MatProgressBarModule,
        MatMenuModule,
        MatIconModule,
        MatButtonModule,
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: TranslateFakeLoader },
        }),
      ],
      declarations: [AppComponent],
      providers: [
        { provide: DataService, useValue: dataSvcSpy },
        { provide: MatSnackBar, useValue: matSnackSpy },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should subscribe to loading and set true', fakeAsync(() => {
    dataSvcSpy.isLoading.next(true);
    tick();
    expect(component.loading).toBeTruthy();
  }));

  it('should subscribe to loading and set false', fakeAsync(() => {
    dataSvcSpy.isLoading.next(false);
    tick();
    expect(component.loading).toBeFalsy();
  }));

  it('should subscribe to message and show snackbar', fakeAsync(() => {
    dataSvcSpy.message.next('TEST');
    tick();
    expect(matSnackSpy.open).toHaveBeenCalledWith('TEST', 'Ok', {
      duration: 3500,
    });
  }));

  it('should change language to es', () => {
    const spy = spyOn(TranslateService.prototype, 'use');
    component.changeLanguage('es');
    expect(spy).toHaveBeenCalledWith('es');
  });

  it('should change language to en', () => {
    const spy = spyOn(TranslateService.prototype, 'use');
    component.changeLanguage('en');
    expect(spy).toHaveBeenCalledWith('en');
  });
});
