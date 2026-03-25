import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SignUp } from 'src/types/auth';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  isSubmitting = false;
  emailErrorMessage = '';
  errorMessage = '';

  form:SignUp = {
    username: '',
    email: '',
    password: ''
  };


  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
  }


  submit(): void {
    if (this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;
    this.emailErrorMessage = '';
    this.errorMessage = '';

    this.authService.signup(this.form).subscribe({
      next: async () => {
        this.authService.setSignedIn();
        await this.router.navigate(['/events']);
        this.isSubmitting = false;
      },
      error: (error) => {
        const message = error?.error?.message || 'Unable to sign up.';
        const field = error?.error?.field;

        if (field === 'email' && message === 'Email already exists') {
          this.emailErrorMessage = 'Email already registered';
        } else if (field === 'email') {
          this.emailErrorMessage = message;
        } else {
          this.errorMessage = message;
        }

        this.isSubmitting = false;
      }
    });
  }
}
