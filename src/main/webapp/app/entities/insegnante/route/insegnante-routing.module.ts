import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { InsegnanteComponent } from '../list/insegnante.component';
import { InsegnanteDetailComponent } from '../detail/insegnante-detail.component';
import { InsegnanteUpdateComponent } from '../update/insegnante-update.component';
import { InsegnanteRoutingResolveService } from './insegnante-routing-resolve.service';

const insegnanteRoute: Routes = [
  {
    path: '',
    component: InsegnanteComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: InsegnanteDetailComponent,
    resolve: {
      insegnante: InsegnanteRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: InsegnanteUpdateComponent,
    resolve: {
      insegnante: InsegnanteRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: InsegnanteUpdateComponent,
    resolve: {
      insegnante: InsegnanteRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(insegnanteRoute)],
  exports: [RouterModule],
})
export class InsegnanteRoutingModule {}
