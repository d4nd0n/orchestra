import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IConcerto } from '../concerto.model';
import { ConcertoService } from '../service/concerto.service';
import { ConcertoDeleteDialogComponent } from '../delete/concerto-delete-dialog.component';

@Component({
  selector: 'jhi-concerto',
  templateUrl: './concerto.component.html',
})
export class ConcertoComponent implements OnInit {
  concertos?: IConcerto[];
  isLoading = false;

  constructor(protected concertoService: ConcertoService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.concertoService.query().subscribe(
      (res: HttpResponse<IConcerto[]>) => {
        this.isLoading = false;
        this.concertos = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IConcerto): number {
    return item.id!;
  }

  delete(concerto: IConcerto): void {
    const modalRef = this.modalService.open(ConcertoDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.concerto = concerto;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
