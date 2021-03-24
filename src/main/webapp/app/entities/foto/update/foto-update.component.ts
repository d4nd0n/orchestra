import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IFoto, Foto } from '../foto.model';
import { FotoService } from '../service/foto.service';
import { IConcerto } from 'app/entities/concerto/concerto.model';
import { ConcertoService } from 'app/entities/concerto/service/concerto.service';

@Component({
  selector: 'jhi-foto-update',
  templateUrl: './foto-update.component.html',
})
export class FotoUpdateComponent implements OnInit {
  isSaving = false;

  concertosSharedCollection: IConcerto[] = [];

  editForm = this.fb.group({
    id: [],
    concerto: [],
  });

  constructor(
    protected fotoService: FotoService,
    protected concertoService: ConcertoService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ foto }) => {
      this.updateForm(foto);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const foto = this.createFromForm();
    if (foto.id !== undefined) {
      this.subscribeToSaveResponse(this.fotoService.update(foto));
    } else {
      this.subscribeToSaveResponse(this.fotoService.create(foto));
    }
  }

  trackConcertoById(index: number, item: IConcerto): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IFoto>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(foto: IFoto): void {
    this.editForm.patchValue({
      id: foto.id,
      concerto: foto.concerto,
    });

    this.concertosSharedCollection = this.concertoService.addConcertoToCollectionIfMissing(this.concertosSharedCollection, foto.concerto);
  }

  protected loadRelationshipsOptions(): void {
    this.concertoService
      .query()
      .pipe(map((res: HttpResponse<IConcerto[]>) => res.body ?? []))
      .pipe(
        map((concertos: IConcerto[]) =>
          this.concertoService.addConcertoToCollectionIfMissing(concertos, this.editForm.get('concerto')!.value)
        )
      )
      .subscribe((concertos: IConcerto[]) => (this.concertosSharedCollection = concertos));
  }

  protected createFromForm(): IFoto {
    return {
      ...new Foto(),
      id: this.editForm.get(['id'])!.value,
      concerto: this.editForm.get(['concerto'])!.value,
    };
  }
}
