import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IConcerto } from '../concerto.model';
import { ConcertoService } from '../service/concerto.service';

@Component({
  templateUrl: './concerto-delete-dialog.component.html',
})
export class ConcertoDeleteDialogComponent {
  concerto?: IConcerto;

  constructor(protected concertoService: ConcertoService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.concertoService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
