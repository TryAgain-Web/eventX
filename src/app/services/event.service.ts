import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { CreateEventRequest, EventRecord } from 'src/types/event';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private baseUrl = 'http://localhost:3000/events';

  httpOptions: { headers: HttpHeaders } = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) {}

  getEvents(): Observable<{ events: EventRecord[] }> {
    return this.http.get<{ events: EventRecord[] }>(this.baseUrl).pipe(first());
  }

  createEvent(payload: CreateEventRequest): Observable<{ message: string; eventId: number }> {
    return this.http
      .post<{ message: string; eventId: number }>(this.baseUrl, payload, this.httpOptions)
      .pipe(first());
  }
}

