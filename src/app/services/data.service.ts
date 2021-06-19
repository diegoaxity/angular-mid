import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { StorageKeys } from '../constants/config';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  isLoading = new Subject<boolean>();
  message = new Subject<string>();

  constructor() {}

  setToken(token: string) {
    sessionStorage.setItem(StorageKeys.token, token);
  }

  getToken(): string {
    return sessionStorage.getItem(StorageKeys.token) || '';
  }

  removeToken() {
    sessionStorage.removeItem(StorageKeys.token);
  }
}
