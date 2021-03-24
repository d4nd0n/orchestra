import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IInsegnante } from '../insegnante.model';
import { InsegnanteService } from '../service/insegnante.service';

@Component({
  templateUrl: './insegnante-delete-dialog.component.html',
})
export class InsegnanteDeleteDialogComponent {
  insegnante?: IInsegnante;

  constructor(protected insegnanteService: InsegnanteService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.insegnanteService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
