import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent } from './profile.component';
import { AddressComponent } from './address/address.component';
import { EditUserComponent } from './edit-user/edit-user.component';
import { AddAddressComponent } from './add-address/add-address.component';
import { MyServiceComponent } from './my-service/my-service.component';
import { CommentComponent } from './comment/comment.component';
import { SharedModule } from 'src/@theme/shared.module';
import { AddReviewComponent } from './my-service/add-review/add-review.component';
import { ChangePswComponent } from './change-psw/change-psw.component';
import { EditAddressComponent } from './edit-address/edit-address.component';
import { ConfirmComponent } from './address/confirm/confirm.component';
import { SelectAddressComponent } from '../cart/select-address/select-address.component';
import { EditaddressComponent } from '../cart/editaddress/editaddress.component';

@NgModule({
  declarations: [
    ProfileComponent,
    AddressComponent,
    SelectAddressComponent,
    EditUserComponent,
    AddAddressComponent,
    MyServiceComponent,
    CommentComponent,
    AddReviewComponent,
    ChangePswComponent,
    EditAddressComponent,
    EditaddressComponent,
    ConfirmComponent,
  ],
  imports: [CommonModule, ProfileRoutingModule, SharedModule],
})
export class ProfileModule {}
