import {
  AfterContentInit,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { DataService } from './services/data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'angular-mid';
  loading = false;

  constructor(
    private dataSvc: DataService,
    private snackbar: MatSnackBar,
    public translate: TranslateService
  ) {
    this.translate.setDefaultLang('es');

    this.dataSvc.isLoading.asObservable().subscribe((loading) => {
      this.loading = loading;
    });

    this.dataSvc.message.asObservable().subscribe((msg) => {
      this.snackbar.open(msg, 'Ok', {
        duration: 3500,
      });
    });
  }

  changeLanguage(lang: string) {
    this.translate.use(lang);
  }
}
