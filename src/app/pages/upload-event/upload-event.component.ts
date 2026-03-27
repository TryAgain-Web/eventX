import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { EventService } from 'src/app/services/event.service';

type UploadEventForm = {
  title: string;
  date: string;
  location: string;
  category: string;
  description: string;
  status: 'active' | 'cancelled';
};

@Component({
  selector: 'app-upload-event',
  templateUrl: './upload-event.component.html',
  styleUrls: ['./upload-event.component.css']
})
export class UploadEventComponent {
  isSubmitting = false;
  errorMessage = '';

  form: UploadEventForm = {
    title: '',
    date: '',
    location: '',
    category: 'Tech',
    description: '',
    status: 'active'
  };

  constructor(
    private authService: AuthService,
    private eventService: EventService,
    private router: Router
  ) {}

  submit(): void {
    if (this.isSubmitting) {
      return;
    }

    const userId = this.authService.getCurrentUserId();
    if (!userId) {
      this.router.navigate(['/login']);
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    const eventDate = this.form.date ? `${this.form.date} 00:00:00` : '';

    this.eventService
      .createEvent({
        user_id: userId,
        title: this.form.title,
        description: this.form.description,
        category: this.form.category,
        location: this.form.location,
        event_date: eventDate,
        status: this.form.status
      })
      .subscribe({
        next: async () => {
          this.isSubmitting = false;
          await this.router.navigate(['/events']);
        },
        error: (error) => {
          this.errorMessage = error?.error?.message || 'Unable to upload event.';
          this.isSubmitting = false;
        }
      });
  }
}

