import { Component, HostListener, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { SidebarService } from '../../services/sidebar.service';
import { UserService } from '../../services/user.service';
import { User } from 'src/types/auth';

@Component({
  selector: 'app-dashboard-layout',
  templateUrl: './dashboard-layout.component.html',
  styleUrls: ['./dashboard-layout.component.css']
})
export class DashboardLayoutComponent implements OnInit, OnDestroy {
  @Input() title = 'Dashboard';

  isSidebarOpen = false;
  isSignedIn$: Observable<boolean>;
  currentUser$: Observable<User | null>;
  readonly defaultAvatarUrl = '/assets/Images/img.jpg';

  private sub?: Subscription;

  constructor(
    private sidebar: SidebarService,
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {
    this.isSignedIn$ = this.authService.isSignedIn$;
    this.currentUser$ = this.userService.currentUser$;
  }

  ngOnInit(): void {
    this.sub = this.sidebar.isOpen$.subscribe((open) => (this.isSidebarOpen = open));

    // Load profile data once for the sidebar/dashboard UI.
    if (this.authService.isSignedIn()) {
      this.userService.loadCurrentUser().subscribe({
        error: () => {
          // Keep UI functional even if profile fetch fails.
        }
      });
    }
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  toggleSidebar(): void {
    this.sidebar.toggle();
  }

  closeSidebar(): void {
    this.sidebar.close();
  }

  async signOut(): Promise<void> {
    this.authService.signOut();
    this.userService.clear();
    this.closeSidebar();
    await this.router.navigate(['/signup']);
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.closeSidebar();
  }
}

