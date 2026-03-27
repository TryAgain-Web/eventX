import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, ValidationErrors, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { UserService } from 'src/app/services/user.service';
import { SocialLinks, UpdateUserRequest, User } from 'src/types/auth';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  isLoading = true;
  isSubmitting = false;

  successMessage = '';
  errorMessage = '';

  previewPictureUrl: string | null = null;

  form = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
    bio: ['', [Validators.maxLength(300)]],
    profilePicture: ['', [this.optionalImageOrUrlValidator.bind(this)]],
    socialLinks: this.fb.group({
      twitter: ['', [this.optionalUrlValidator.bind(this)]],
      github: ['', [this.optionalUrlValidator.bind(this)]],
      linkedin: ['', [this.optionalUrlValidator.bind(this)]]
    })
  });

  constructor(private fb: FormBuilder, private userService: UserService) {}

  ngOnInit(): void {
    this.userService.loadCurrentUser().subscribe({
      next: (user) => {
        this.patchFormFromUser(user);
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Unable to load your profile.';
        this.isLoading = false;
      }
    });
  }

  get usernameCtrl(): AbstractControl {
    return this.form.get('username') as AbstractControl;
  }

  get bioCtrl(): AbstractControl {
    return this.form.get('bio') as AbstractControl;
  }

  get profilePictureCtrl(): AbstractControl {
    return this.form.get('profilePicture') as AbstractControl;
  }

  get twitterCtrl(): AbstractControl {
    return (this.form.get('socialLinks')?.get('twitter') as AbstractControl) || ({} as AbstractControl);
  }

  get githubCtrl(): AbstractControl {
    return (this.form.get('socialLinks')?.get('github') as AbstractControl) || ({} as AbstractControl);
  }

  get linkedinCtrl(): AbstractControl {
    return (this.form.get('socialLinks')?.get('linkedin') as AbstractControl) || ({} as AbstractControl);
  }

  submit(): void {
    if (this.isSubmitting) {
      return;
    }

    this.successMessage = '';
    this.errorMessage = '';

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    const value = this.form.value as {
      username: string;
      bio: string;
      profilePicture: string;
      socialLinks: SocialLinks;
    };

    const trimmedBio = value.bio?.trim() || '';
    const trimmedProfilePicture = value.profilePicture?.trim() || '';

    const normalizedSocialLinks: SocialLinks = {};
    for (const [key, raw] of Object.entries(value.socialLinks || {})) {
      const v = (raw || '').trim();
      if (v) {
        normalizedSocialLinks[key] = v;
      }
    }

    const payload: UpdateUserRequest = {
      username: value.username.trim(),
      bio: trimmedBio ? trimmedBio : null,
      profilePicture: trimmedProfilePicture ? trimmedProfilePicture : null,
      socialLinks: Object.keys(normalizedSocialLinks).length ? normalizedSocialLinks : null
    };

    this.userService
      .updateProfile(payload)
      .pipe(
        finalize(() => {
          this.isSubmitting = false;
        })
      )
      .subscribe({
        next: (updatedUser: User) => {
          this.patchFormFromUser(updatedUser);
          this.successMessage = 'Profile updated successfully.';
        },
        error: (error) => {
          this.errorMessage = error?.error?.message || 'Unable to update profile.';
        }
      });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith('image/')) {
      this.errorMessage = 'Please select a valid image file.';
      return;
    }

    this.errorMessage = '';
    this.successMessage = '';

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = typeof reader.result === 'string' ? reader.result : null;
      if (!dataUrl) {
        this.errorMessage = 'Unable to read selected image.';
        return;
      }

      this.previewPictureUrl = dataUrl;
      this.form.patchValue({ profilePicture: dataUrl });
    };
    reader.onerror = () => {
      this.errorMessage = 'Unable to read selected image.';
    };

    reader.readAsDataURL(file);
  }

  removeProfilePicture(): void {
    this.previewPictureUrl = null;
    this.form.patchValue({ profilePicture: '' });
  }

  private patchFormFromUser(user: User): void {
    this.previewPictureUrl = user.profilePicture || null;

    const social = user.socialLinks || {};
    this.form.patchValue({
      username: user.username || '',
      bio: user.bio || '',
      profilePicture: user.profilePicture || '',
      socialLinks: {
        twitter: social.twitter || '',
        github: social.github || '',
        linkedin: social.linkedin || ''
      }
    });
  }

  private optionalUrlValidator(control: AbstractControl): ValidationErrors | null {
    const value = (control.value ?? '').trim();
    if (!value) {
      return null;
    }

    try {
      const url = new URL(value);
      if (url.protocol !== 'http:' && url.protocol !== 'https:') {
        return { invalidUrl: true };
      }
      return null;
    } catch {
      return { invalidUrl: true };
    }
  }

  private optionalImageOrUrlValidator(control: AbstractControl): ValidationErrors | null {
    const value = (control.value ?? '').trim();
    if (!value) {
      return null;
    }

    // Accept a data URL (e.g. uploaded image) or a real http(s) URL.
    if (value.startsWith('data:image/')) {
      return null;
    }

    try {
      const url = new URL(value);
      if (url.protocol !== 'http:' && url.protocol !== 'https:') {
        return { invalidImageUrl: true };
      }
      return null;
    } catch {
      return { invalidImageUrl: true };
    }
  }

}
