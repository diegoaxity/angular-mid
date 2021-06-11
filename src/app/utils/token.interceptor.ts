import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError, TimeoutError } from 'rxjs';
import { AppConfig, ExcludedEndpoints } from '../constants/config';
import { DataService } from '../services/data.service';
import { catchError, timeout } from 'rxjs/operators';
import { Messages } from '../constants/messages';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private dataSvc: DataService) {}

  private addToken(req: HttpRequest<any>): HttpRequest<any> {
    if (this.isEndpointExcluded(req.url)) {
      return req;
    }

    const token = this.dataSvc.getToken();
    let newReq;
    if (token) {
      newReq = req.clone({
        headers: req.headers.append('Authorization', 'Bearer ' + token),
      });
    }

    return newReq ? newReq : req;
  }

  private isEndpointExcluded(path: string): boolean {
    const excluded =
      ExcludedEndpoints.find((e) => {
        // htts://reqres.in/api/users
        return path.includes(e);
      }) || [];
    return excluded.length > 0;
  }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const modReq = this.addToken(req);
    return next.handle(modReq).pipe(
      timeout(AppConfig.defaultTimeout),
      catchError((err: any) => {
        if (err instanceof TimeoutError) {
          return throwError(Messages.errors.timeout);
        }
        if (err instanceof HttpErrorResponse) {
          let msg = Messages.errors.general;
          if (err.status === 404) {
            msg = Messages.errors.notFound;
          }
          if (err.status === 500) {
            msg = Messages.errors.server;
          }
          return throwError(err.error.error || msg);
        }

        return throwError(Messages.errors.general);
      })
    );
  }
}
