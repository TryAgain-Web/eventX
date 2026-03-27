import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { EventService } from 'src/app/services/event.service';
import { EventRecord } from 'src/types/event';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {
  isSignedIn$: Observable<boolean>;
  events: EventRecord[] = [];
  isLoading = true;
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router, private eventService: EventService) {
    this.isSignedIn$ = this.authService.isSignedIn$;
  }

  ngOnInit(): void {
    this.loadEvents();
  }

  async goToUpload(): Promise<void> {
    if (this.authService.isSignedIn()) {
      await this.router.navigate(['/upload-event']);
      return;
    }

    await this.router.navigate(['/login']);
  }

  private loadEvents(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.eventService.getEvents().subscribe({
      next: (response) => {
        this.events = response.events;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = error?.error?.message || 'Unable to load events.';
        this.isLoading = false;
      }
    });
  }
}
