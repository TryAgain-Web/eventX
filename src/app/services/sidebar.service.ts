import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  private readonly openSubject = new BehaviorSubject<boolean>(false);
  readonly isOpen$: Observable<boolean> = this.openSubject.asObservable();

  toggle(): void {
    this.openSubject.next(!this.openSubject.value);
  }

  open(): void {
    this.openSubject.next(true);
  }

  close(): void {
    this.openSubject.next(false);
  }
}

