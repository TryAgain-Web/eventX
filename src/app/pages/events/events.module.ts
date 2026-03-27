import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventsComponent } from './events.component';
import { EventsRoutingModule } from './events-routing.module';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [EventsComponent],
  imports: [CommonModule, EventsRoutingModule, SharedModule]
})
export class EventsModule {}

