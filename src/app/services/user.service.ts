import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SingleUserReponse, UserResponse } from '../model/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  getUsers(): Observable<UserResponse> {
    return this.http.get<UserResponse>(`${environment.apiUrl}/users`);
  }

  getUser(id: number): Observable<SingleUserReponse> {
    return this.http.get<SingleUserReponse>(
      `${environment.apiUrl}/users/${id}`
    );
  }
}
