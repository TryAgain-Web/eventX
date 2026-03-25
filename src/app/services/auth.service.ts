import { ErrorHandlerService } from './error-handler.service';
import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { User } from 'src/types/auth';
import { Observable } from 'rxjs';
import { first, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private Url = 'http://localhost:3000/auth/signup';

  httpOptions: { headers: HttpHeaders} = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  }

  constructor(private http: HttpClient, private ErrorHandlerService: ErrorHandlerService) { }

  signup(user: Omit<User, 'id'>): Observable<User>{
    return this.http.post<User>(this.Url, user, this.httpOptions).pipe(
      first(),
      catchError(this.ErrorHandlerService.handleError<User>("signup"))
    )
  }
}
