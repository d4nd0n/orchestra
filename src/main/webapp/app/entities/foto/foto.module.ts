import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { FotoComponent } from './list/foto.component';
import { FotoDetailComponent } from './detail/foto-detail.component';
import { FotoUpdateComponent } from './update/foto-update.component';
import { FotoDeleteDialogComponent } from './delete/foto-delete-dialog.component';
import { FotoRoutingModule } from './route/foto-routing.module';

@NgModule({
  imports: [SharedModule, FotoRoutingModule],
  declarations: [FotoComponent, FotoDetailComponent, FotoUpdateComponent, FotoDeleteDialogComponent],
  entryComponents: [FotoDeleteDialogComponent],
})
export class FotoModule {}
