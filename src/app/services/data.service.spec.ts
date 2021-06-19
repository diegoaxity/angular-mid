import { TestBed } from '@angular/core/testing';
import { StorageKeys } from '../constants/config';

import { DataService } from './data.service';

describe('DataService', () => {
  let service: DataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be creating a session storage token', () => {
    service.setToken('12345');
    expect(sessionStorage.getItem(StorageKeys.token)).toBe('12345');
  });

  it('should get token from session storage', () => {
    sessionStorage.setItem(StorageKeys.token, 'TEST');
    expect(service.getToken()).toBe('TEST');
  });

  it('should get token from session storage and be empty string', () => {
    sessionStorage.removeItem(StorageKeys.token);
    expect(service.getToken()).toBe('');
  });

  it('should delete token from session storage', () => {
    service.removeToken();
    expect(sessionStorage.getItem(StorageKeys.token)).toBeNull();
  });
});
