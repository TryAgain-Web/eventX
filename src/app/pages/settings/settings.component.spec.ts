import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';

import { SettingsComponent } from './settings.component';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/types/auth';

describe('SettingsComponent', () => {
  let component: SettingsComponent;
  let fixture: ComponentFixture<SettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SettingsComponent],
      imports: [ReactiveFormsModule],
      providers: [
        {
          provide: UserService,
          useValue: {
            loadCurrentUser: () =>
              of({
                id: 1,
                username: 'testuser',
                email: 'test@example.com',
                password: 'secret',
                bio: null,
                profilePicture: null,
                socialLinks: null
              } as User),
            updateProfile: () =>
              of({
                id: 1,
                username: 'testuser',
                email: 'test@example.com',
                password: 'secret',
                bio: null,
                profilePicture: null,
                socialLinks: null
              } as User)
          }
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
