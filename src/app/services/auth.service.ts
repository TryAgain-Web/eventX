import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Login, User, AuthSuccessResponse } from 'src/types/auth';
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

  signup(user: Omit<User, 'id'>): Observable<AuthSuccessResponse>{
    return this.http.post<AuthSuccessResponse>(`${this.baseUrl}/signup`, user, this.httpOptions).pipe(
      first()
    )
  }

  login(credentials: Login): Observable<AuthSuccessResponse> {
    return this.http.post<AuthSuccessResponse>(`${this.baseUrl}/login`, credentials, this.httpOptions).pipe(
      first()
    );
  }

  setSignedIn(userId: number): void {
    localStorage.setItem('eventx_signed_in', 'true');
    localStorage.setItem('eventx_user_id', String(userId));
    this.signedInSubject.next(true);
  }

  signOut(): void {
    localStorage.removeItem('eventx_signed_in');
    localStorage.removeItem('eventx_user_id');
    this.signedInSubject.next(false);
  }

  isSignedIn(): boolean {
    return this.signedInSubject.value;
  }

  getCurrentUserId(): number | null {
    const value = localStorage.getItem('eventx_user_id');
    if (!value) {
      return null;
    }

    const parsed = Number(value);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
  }

  private hasStoredSession(): boolean {
    return localStorage.getItem('eventx_signed_in') === 'true';
  }
}
