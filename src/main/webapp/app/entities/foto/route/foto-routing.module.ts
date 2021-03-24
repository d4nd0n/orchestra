import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { FotoComponent } from '../list/foto.component';
import { FotoDetailComponent } from '../detail/foto-detail.component';
import { FotoUpdateComponent } from '../update/foto-update.component';
import { FotoRoutingResolveService } from './foto-routing-resolve.service';

const fotoRoute: Routes = [
  {
    path: '',
    component: FotoComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: FotoDetailComponent,
    resolve: {
      foto: FotoRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: FotoUpdateComponent,
    resolve: {
      foto: FotoRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: FotoUpdateComponent,
    resolve: {
      foto: FotoRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(fotoRoute)],
  exports: [RouterModule],
})
export class FotoRoutingModule {}
