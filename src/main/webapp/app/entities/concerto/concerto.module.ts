import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { ConcertoComponent } from './list/concerto.component';
import { ConcertoDetailComponent } from './detail/concerto-detail.component';
import { ConcertoUpdateComponent } from './update/concerto-update.component';
import { ConcertoDeleteDialogComponent } from './delete/concerto-delete-dialog.component';
import { ConcertoRoutingModule } from './route/concerto-routing.module';

@NgModule({
  imports: [SharedModule, ConcertoRoutingModule],
  declarations: [ConcertoComponent, ConcertoDetailComponent, ConcertoUpdateComponent, ConcertoDeleteDialogComponent],
  entryComponents: [ConcertoDeleteDialogComponent],
})
export class ConcertoModule {}
