import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ICorso } from '../corso.model';
import { CorsoService } from '../service/corso.service';

@Component({
  templateUrl: './corso-delete-dialog.component.html',
})
export class CorsoDeleteDialogComponent {
  corso?: ICorso;

  constructor(protected corsoService: CorsoService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.corsoService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
