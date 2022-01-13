import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { CartComponent } from './cart/cart.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { ContactComponent } from './contact/contact.component';
import { MappageComponent } from './mappage/mappage.component';
import { PolicyComponent } from './policy/policy.component';
import { ProfileComponent } from './profile/profile.component';
import { ShopComponent } from './shop/shop.component';
import { TermComponent } from './term/term.component';
import { TrackingComponent } from './tracking/tracking.component';
import { TrackingmapComponent } from './trackingmap/trackingmap.component';
import { GetAllShopComponent } from './get-all-shop/get-all-shop.component';

const routes: Routes = [
  { path: 'map', component: MappageComponent },
  { path: 'shop', component: ShopComponent },
  { path: 'shop/:id', component: ShopComponent },
  { path: 'checkout/:id', component: CheckoutComponent },
  { path: 'about', component: AboutComponent },
  { path: 'tracking', component: TrackingComponent },
  { path: 'trackmap/:Id', component: TrackingmapComponent },
  { path: 'trackmap', component: TrackingmapComponent },
  { path: 'cart', component: CartComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'policy', component: PolicyComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'term', component: TermComponent },
  { path: 'filterShop', component: GetAllShopComponent },

  {
    path: '',
    loadChildren: () =>
      import('./home-page/home-page.module').then((m) => m.HomePageModule),
  },
  {
    path: 'header',
    loadChildren: () =>
      import('./header-module/header-module.module').then(
        (m) => m.HeaderModuleModule
      ),
  },
  {
    path: 'home',
    loadChildren: () =>
      import('./home-page/home-page.module').then((m) => m.HomePageModule),
  },
  {
    path: 'header-module',
    loadChildren: () =>
      import('./header-module/header-module.module').then(
        (m) => m.HeaderModuleModule
      ),
  },
  {
    path: 'profile',
    loadChildren: () =>
      import('./profile/profile.module').then((m) => m.ProfileModule),
  },
  {
    path: 'profile',
    loadChildren: () =>
      import('./profile/profile.module').then((m) => m.ProfileModule),
  },
  { path: '**', pathMatch: 'full', redirectTo: '' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'enabled',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
