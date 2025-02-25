import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { catchError, Observable } from 'rxjs';
import { ITheme } from '../../models/theme.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  private httpClient=inject(HttpClient);
  private apiURL=environment.apiURL+"/theme";
  constructor() { }

  getThemes():Observable<ITheme[]>{
    return this.httpClient.get<ITheme[]>(this.apiURL)
    .pipe(
      catchError((error) => {
        console.error(error);
        return [];
      })
    );
  }
}
