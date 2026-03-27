import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { SidebarService } from '../services/sidebar.service';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  isSignedIn$: Observable<boolean>;
  title = 'EventX';
  isHome = false;
  private sub?: Subscription;

  constructor(
    private authService: AuthService,
    private sidebar: SidebarService,
    private router: Router
  ) {
    this.isSignedIn$ = this.authService.isSignedIn$;
  }

  ngOnInit(): void {
    const syncHomeFlag = (): void => {
      const url = (this.router.url || '').split('?')[0];
      this.isHome = url === '' || url === '/';
    };

    syncHomeFlag();

    this.sub = this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(() => syncHomeFlag());
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  toggleSidebar(): void {
    if (!this.authService.isSignedIn()) {
      return;
    }

    this.sidebar.toggle();
  }
}
