import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { CorsoComponent } from '../list/corso.component';
import { CorsoDetailComponent } from '../detail/corso-detail.component';
import { CorsoUpdateComponent } from '../update/corso-update.component';
import { CorsoRoutingResolveService } from './corso-routing-resolve.service';

const corsoRoute: Routes = [
  {
    path: '',
    component: CorsoComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: CorsoDetailComponent,
    resolve: {
      corso: CorsoRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: CorsoUpdateComponent,
    resolve: {
      corso: CorsoRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: CorsoUpdateComponent,
    resolve: {
      corso: CorsoRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(corsoRoute)],
  exports: [RouterModule],
})
export class CorsoRoutingModule {}
