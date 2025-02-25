import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment.development';
import { ICredentials, User, IUser, IAuthResponse } from '../../models/user.model';
import { catchError, map, Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private httpClient=inject(HttpClient);
  private router=inject(Router);
  private apiUrl=environment.apiURL+"/user";
  public user=signal<User|null|undefined>(undefined);
  constructor() { }

  public login(credentials:ICredentials):Observable<User|null>
  {
    return this.httpClient.post<IAuthResponse>(this.apiUrl+'/login', credentials)
      .pipe(
      map(
        authResponse => {
          localStorage.setItem('token', authResponse.token);
          const user = new User(authResponse.user);
          this.user.set(user);
          return user;
  }),
      catchError(error => {
        this.user.set(null);
        return of(null);
      })
      );
  }

  public logout():Observable<boolean>{
    return this.httpClient.post<any>(this.apiUrl+'/logout', {})
    .pipe(
      map(_=> {
        this.user.set(null);
        localStorage.removeItem('token');
        return true;
      }),
      catchError(error => {
        return of(false);
      })
    );
  }

  public getUser():Observable<User|null>{
    return this.httpClient.get<IUser>(this.apiUrl)
    .pipe(
      map(IUser => {
        let user=new User(IUser);
        this.user.set(user);
        return user;
      }),
      catchError(error => {
        this.user.set(null);
        return of(null);
      })
    );
  }
}
