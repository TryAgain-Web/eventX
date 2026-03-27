import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyeventsComponent } from './myevents.component';
import { MyeventsRoutingModule } from './myevents-routing.module';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [MyeventsComponent],
  imports: [CommonModule, MyeventsRoutingModule, SharedModule]
})
export class MyeventsModule {}

