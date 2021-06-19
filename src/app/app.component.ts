import { AfterViewInit, Component, OnInit } from '@angular/core';
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
  languageSelected = 'es';

  constructor(
    private dataSvc: DataService,
    private snackbar: MatSnackBar,
    private translate: TranslateService
  ) {
    this.dataSvc.isLoading.asObservable().subscribe((loading) => {
      this.loading = loading;
    });

    this.dataSvc.message.asObservable().subscribe((msg) => {
      this.snackbar.open(msg, 'Ok', {
        duration: 3500,
      });
    });

    this.translate.setDefaultLang(this.languageSelected);
  }

  changeLanguage() {
    this.translate.use(this.languageSelected);
  }
}
