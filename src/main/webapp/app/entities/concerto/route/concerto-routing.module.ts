import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ConcertoComponent } from '../list/concerto.component';
import { ConcertoDetailComponent } from '../detail/concerto-detail.component';
import { ConcertoUpdateComponent } from '../update/concerto-update.component';
import { ConcertoRoutingResolveService } from './concerto-routing-resolve.service';

const concertoRoute: Routes = [
  {
    path: '',
    component: ConcertoComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ConcertoDetailComponent,
    resolve: {
      concerto: ConcertoRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ConcertoUpdateComponent,
    resolve: {
      concerto: ConcertoRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ConcertoUpdateComponent,
    resolve: {
      concerto: ConcertoRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(concertoRoute)],
  exports: [RouterModule],
})
export class ConcertoRoutingModule {}
