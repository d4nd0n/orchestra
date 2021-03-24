import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IFoto } from '../foto.model';
import { FotoService } from '../service/foto.service';

@Component({
  templateUrl: './foto-delete-dialog.component.html',
})
export class FotoDeleteDialogComponent {
  foto?: IFoto;

  constructor(protected fotoService: FotoService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.fotoService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
