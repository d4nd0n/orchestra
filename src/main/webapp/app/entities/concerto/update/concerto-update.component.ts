import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IConcerto, Concerto } from '../concerto.model';
import { ConcertoService } from '../service/concerto.service';
import { ICorso } from 'app/entities/corso/corso.model';
import { CorsoService } from 'app/entities/corso/service/corso.service';

@Component({
  selector: 'jhi-concerto-update',
  templateUrl: './concerto-update.component.html',
})
export class ConcertoUpdateComponent implements OnInit {
  isSaving = false;

  corsosSharedCollection: ICorso[] = [];

  editForm = this.fb.group({
    id: [],
    date: [],
    hours: [],
    location: [],
    corso: [],
  });

  constructor(
    protected concertoService: ConcertoService,
    protected corsoService: CorsoService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ concerto }) => {
      this.updateForm(concerto);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const concerto = this.createFromForm();
    if (concerto.id !== undefined) {
      this.subscribeToSaveResponse(this.concertoService.update(concerto));
    } else {
      this.subscribeToSaveResponse(this.concertoService.create(concerto));
    }
  }

  trackCorsoById(index: number, item: ICorso): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IConcerto>>): void {
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

  protected updateForm(concerto: IConcerto): void {
    this.editForm.patchValue({
      id: concerto.id,
      date: concerto.date,
      hours: concerto.hours,
      location: concerto.location,
      corso: concerto.corso,
    });

    this.corsosSharedCollection = this.corsoService.addCorsoToCollectionIfMissing(this.corsosSharedCollection, concerto.corso);
  }

  protected loadRelationshipsOptions(): void {
    this.corsoService
      .query()
      .pipe(map((res: HttpResponse<ICorso[]>) => res.body ?? []))
      .pipe(map((corsos: ICorso[]) => this.corsoService.addCorsoToCollectionIfMissing(corsos, this.editForm.get('corso')!.value)))
      .subscribe((corsos: ICorso[]) => (this.corsosSharedCollection = corsos));
  }

  protected createFromForm(): IConcerto {
    return {
      ...new Concerto(),
      id: this.editForm.get(['id'])!.value,
      date: this.editForm.get(['date'])!.value,
      hours: this.editForm.get(['hours'])!.value,
      location: this.editForm.get(['location'])!.value,
      corso: this.editForm.get(['corso'])!.value,
    };
  }
}
