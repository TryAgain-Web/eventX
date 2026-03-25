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


  constructor() { }

  ngOnInit(): void {
  }


  submit(){
    console.log(this.form);
  }
}
