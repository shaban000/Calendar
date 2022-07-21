import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  login: { email: string; password: string } = {
    email: '',
    password: '',
  };
  signup: { name: string; email: string; password: string } = {
    name: '',
    email: '',
    password: '',
  };
  constructor(private router: Router) {}
  ngOnInit() {}

  async onLogin() {
    await fetch('http://localhost:3000/api/user/login ', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: JSON.stringify(this.login),
    })
      .then((response) => response.json())
      .then((data) => this.saveTokens(data))
      .catch(function (error) {
        console.log('error', error);
      });
  }

  async onSignup() {
    await fetch('http://localhost:3000/api/user/signup ', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: JSON.stringify(this.signup),
    })
      .then((response) => response.json())
      .then((data) => this.saveTokens(data))
      .catch(function (error) {
        console.log('error', error);
      });
  }

  saveTokens(data: any) {
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    this.router.navigate(['/calendar']);
  }
}
