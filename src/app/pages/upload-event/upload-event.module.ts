import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UploadEventComponent } from './upload-event.component';
import { UploadEventRoutingModule } from './upload-event-routing.module';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [UploadEventComponent],
  imports: [CommonModule, FormsModule, UploadEventRoutingModule, SharedModule]
})
export class UploadEventModule {}

