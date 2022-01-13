import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { HomePageRoutingModule } from "./home-page-routing.module";
import { HomePageComponent } from "./home-page.component";
import { HomeDetailsComponent } from "./home-details/home-details.component";
import { SharedModule } from "src/@theme/shared.module";
import { DriverComponent } from './driver/driver.component';

@NgModule({
  declarations: [HomePageComponent, HomeDetailsComponent, DriverComponent],
  imports: [CommonModule, HomePageRoutingModule, SharedModule],
})
export class HomePageModule {}
