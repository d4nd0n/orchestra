import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ICorso } from '../corso.model';
import { CorsoService } from '../service/corso.service';
import { CorsoDeleteDialogComponent } from '../delete/corso-delete-dialog.component';

@Component({
  selector: 'jhi-corso',
  templateUrl: './corso.component.html',
})
export class CorsoComponent implements OnInit {
  corsos?: ICorso[];
  isLoading = false;

  constructor(protected corsoService: CorsoService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.corsoService.query().subscribe(
      (res: HttpResponse<ICorso[]>) => {
        this.isLoading = false;
        this.corsos = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: ICorso): number {
    return item.id!;
  }

  delete(corso: ICorso): void {
    const modalRef = this.modalService.open(CorsoDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.corso = corso;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
