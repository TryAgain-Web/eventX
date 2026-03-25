import { Component, OnInit } from '@angular/core';
import { Login } from 'src/types/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  form:Login = {
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
