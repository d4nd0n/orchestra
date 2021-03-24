import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IInsegnante } from '../insegnante.model';
import { InsegnanteService } from '../service/insegnante.service';
import { InsegnanteDeleteDialogComponent } from '../delete/insegnante-delete-dialog.component';

@Component({
  selector: 'jhi-insegnante',
  templateUrl: './insegnante.component.html',
})
export class InsegnanteComponent implements OnInit {
  insegnantes?: IInsegnante[];
  isLoading = false;

  constructor(protected insegnanteService: InsegnanteService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.insegnanteService.query().subscribe(
      (res: HttpResponse<IInsegnante[]>) => {
        this.isLoading = false;
        this.insegnantes = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IInsegnante): number {
    return item.id!;
  }

  delete(insegnante: IInsegnante): void {
    const modalRef = this.modalService.open(InsegnanteDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.insegnante = insegnante;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
