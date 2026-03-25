import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { SignUp } from 'src/types/auth';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  form:SignUp = {
    username: '',
    email: '',
    password: ''
  };


  constructor(private authService: AuthService) { }

  ngOnInit(): void {
  }


  submit(): void {
    this.authService.signup(this.form).subscribe((msg) => console.log(msg));
  }
}
