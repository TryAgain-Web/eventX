import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FooterComponent } from '../footer/footer.component';
import { DashboardLayoutComponent } from '../layouts/dashboard-layout/dashboard-layout.component';

@NgModule({
  declarations: [FooterComponent, DashboardLayoutComponent],
  imports: [CommonModule, RouterModule],
  exports: [FooterComponent, DashboardLayoutComponent]
})
export class SharedModule {}

