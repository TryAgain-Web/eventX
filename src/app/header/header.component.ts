import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isSignedIn$: Observable<boolean>;
  title = 'EventX';

  constructor(private authService: AuthService, private router: Router) {
    this.isSignedIn$ = this.authService.isSignedIn$;
  }

  ngOnInit(): void {
  }

  async signOut(): Promise<void> {
    this.authService.signOut();
    await this.router.navigate(['/signup']);
  }
}
