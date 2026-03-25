import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Login, User } from 'src/types/auth';
import { BehaviorSubject, Observable } from 'rxjs';
import { first } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:3000/auth';
  private signedInSubject = new BehaviorSubject<boolean>(this.hasStoredSession());
  isSignedIn$ = this.signedInSubject.asObservable();

  httpOptions: { headers: HttpHeaders} = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  }

  constructor(private http: HttpClient) { }

  signup(user: Omit<User, 'id'>): Observable<User>{
    return this.http.post<User>(`${this.baseUrl}/signup`, user, this.httpOptions).pipe(
      first()
    )
  }

  login(credentials: Login): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.baseUrl}/login`, credentials, this.httpOptions).pipe(
      first()
    );
  }

  setSignedIn(): void {
    localStorage.setItem('eventx_signed_in', 'true');
    this.signedInSubject.next(true);
  }

  signOut(): void {
    localStorage.removeItem('eventx_signed_in');
    this.signedInSubject.next(false);
  }

  private hasStoredSession(): boolean {
    return localStorage.getItem('eventx_signed_in') === 'true';
  }
}
