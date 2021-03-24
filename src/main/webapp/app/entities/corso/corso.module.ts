import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { CorsoComponent } from './list/corso.component';
import { CorsoDetailComponent } from './detail/corso-detail.component';
import { CorsoUpdateComponent } from './update/corso-update.component';
import { CorsoDeleteDialogComponent } from './delete/corso-delete-dialog.component';
import { CorsoRoutingModule } from './route/corso-routing.module';

@NgModule({
  imports: [SharedModule, CorsoRoutingModule],
  declarations: [CorsoComponent, CorsoDetailComponent, CorsoUpdateComponent, CorsoDeleteDialogComponent],
  entryComponents: [CorsoDeleteDialogComponent],
})
export class CorsoModule {}
