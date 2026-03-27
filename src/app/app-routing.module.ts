import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./pages/home/home.module').then((m) => m.HomeModule)
  },
  {
    path: '',
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule)
  },
  {
    path: 'events',
    loadChildren: () => import('./pages/events/events.module').then((m) => m.EventsModule)
  },
  {
    path: 'myevents',
    loadChildren: () => import('./pages/myevents/myevents.module').then((m) => m.MyeventsModule)
  },
  {
    path: 'settings',
    loadChildren: () => import('./pages/settings/settings.module').then((m) => m.SettingsModule)
  },
  {
    path: 'upload-event',
    loadChildren: () => import('./pages/upload-event/upload-event.module').then((m) => m.UploadEventModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
