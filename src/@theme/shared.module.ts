import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { IvyCarouselModule } from 'angular-responsive-carousel';
import { NgOtpInputModule } from 'ng-otp-input';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { CommonService } from './Services/common.service';
import { HeaderService } from './Services/header.service';
import { JwtTokenService } from './services/jwt-token.service';
import { MapService } from './Services/map.service';
import { ShopService } from './Services/shop.service';
import { StoreTokenService } from './Services/store-token.service';
import { ProfileService } from './Services/profile.service';
import { UploadService } from './Services/upload.service';
import { NgxStarRatingModule } from 'ngx-star-rating';
import { TooltipModule } from 'ng2-tooltip-directive';
import { MetaserviceService } from './Services/metaservice.service';
const NB_Module = [
  NgbModule,
  SlickCarouselModule,
  HttpClientModule,
  IvyCarouselModule,
  FormsModule,
  NgSelectModule,
  ReactiveFormsModule,
  NgxDropzoneModule,
  NgOtpInputModule,
  NgxStarRatingModule,
  TooltipModule,
];
@NgModule({
  imports: [CommonModule, ...NB_Module],
  exports: [CommonModule, ...NB_Module],
  providers: [
    HeaderService,
    JwtTokenService,
    StoreTokenService,
    CommonService,
    MapService,
    ShopService,
    UploadService,
    ProfileService,
    MetaserviceService,
  ],
})
export class SharedModule {}
