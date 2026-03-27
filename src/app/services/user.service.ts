import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { SocialLinks, UpdateUserRequest, User } from 'src/types/auth';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = 'http://localhost:3000/auth';

  private readonly userSubject = new BehaviorSubject<User | null>(null);
  readonly currentUser$ = this.userSubject.asObservable();

  private hasLoaded = false;

  private httpOptions: { headers: HttpHeaders } = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient, private authService: AuthService) {}

  loadCurrentUser(): Observable<User> {
    const userId = this.authService.getCurrentUserId();
    if (!userId) {
      return throwError(() => new Error('No user id in session'));
    }

    if (this.hasLoaded && this.userSubject.value) {
      return of(this.userSubject.value);
    }

    return this.http.get<User>(`${this.baseUrl}/user/${userId}`, this.httpOptions).pipe(
      tap((user) => {
        this.userSubject.next(user);
        this.hasLoaded = true;
      })
    );
  }

  updateProfile(payload: UpdateUserRequest): Observable<User> {
    const userId = this.authService.getCurrentUserId();
    if (!userId) {
      return throwError(() => new Error('No user id in session'));
    }

    // Normalize: avoid sending empty strings for social fields.
    const normalizedSocialLinks: SocialLinks | null =
      payload.socialLinks && typeof payload.socialLinks === 'object'
        ? Object.fromEntries(
            Object.entries(payload.socialLinks).map(([k, v]) => [k, (v || '').trim() || undefined])
          )
        : payload.socialLinks ?? null;

    const normalizedPayload: UpdateUserRequest = {
      ...payload,
      username: payload.username.trim(),
      bio: payload.bio ? payload.bio.trim() : null,
      profilePicture: payload.profilePicture ? payload.profilePicture.trim() : null,
      socialLinks: normalizedSocialLinks
    };

    return this.http
      .put<User>(`${this.baseUrl}/user/${userId}`, normalizedPayload, this.httpOptions)
      .pipe(
        tap((updated) => {
          this.userSubject.next(updated);
          this.hasLoaded = true;
        })
      );
  }

  clear(): void {
    this.hasLoaded = false;
    this.userSubject.next(null);
  }
}

