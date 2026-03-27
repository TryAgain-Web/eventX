import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { Login } from 'src/types/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  isSubmitting = false;
  errorMessage = '';
  emailErrorMessage = '';

  form:Login = {
    email: '',
    password: ''
  };

  constructor(private router: Router, private authService: AuthService) { }


  ngOnInit(): void {
  }
  async submit(): Promise<void> {
    if (this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    this.emailErrorMessage = '';

    this.authService.login(this.form).subscribe({
      next: async (response) => {
        this.authService.setSignedIn(response.userId);
        await this.router.navigate(['/events']);
        this.isSubmitting = false;
      },
      error: (error) => {
        const message = error?.error?.message || 'Unable to log in.';

        if (message === 'Email not found') {
          this.emailErrorMessage = "This email isn't in the database.";
        } else {
          this.errorMessage = message;
        }

        this.isSubmitting = false;
      }
    });
  }

}
