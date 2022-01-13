import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HeaderModuleComponent } from './header-module.component';
import { ProblemsComponent } from './problems/problems.component';

const routes: Routes = [
  { path: '', component: HeaderModuleComponent },
  { path: 'problems', component: ProblemsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HeaderModuleRoutingModule {}
