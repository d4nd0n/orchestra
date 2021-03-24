import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IFoto } from '../foto.model';
import { FotoService } from '../service/foto.service';
import { FotoDeleteDialogComponent } from '../delete/foto-delete-dialog.component';

@Component({
  selector: 'jhi-foto',
  templateUrl: './foto.component.html',
})
export class FotoComponent implements OnInit {
  fotos?: IFoto[];
  isLoading = false;

  constructor(protected fotoService: FotoService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.fotoService.query().subscribe(
      (res: HttpResponse<IFoto[]>) => {
        this.isLoading = false;
        this.fotos = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IFoto): number {
    return item.id!;
  }

  delete(foto: IFoto): void {
    const modalRef = this.modalService.open(FotoDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.foto = foto;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
