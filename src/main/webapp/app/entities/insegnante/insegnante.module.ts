import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { InsegnanteComponent } from './list/insegnante.component';
import { InsegnanteDetailComponent } from './detail/insegnante-detail.component';
import { InsegnanteUpdateComponent } from './update/insegnante-update.component';
import { InsegnanteDeleteDialogComponent } from './delete/insegnante-delete-dialog.component';
import { InsegnanteRoutingModule } from './route/insegnante-routing.module';

@NgModule({
  imports: [SharedModule, InsegnanteRoutingModule],
  declarations: [InsegnanteComponent, InsegnanteDetailComponent, InsegnanteUpdateComponent, InsegnanteDeleteDialogComponent],
  entryComponents: [InsegnanteDeleteDialogComponent],
})
export class InsegnanteModule {}
