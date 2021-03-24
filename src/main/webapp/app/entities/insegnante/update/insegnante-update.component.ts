import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IInsegnante, Insegnante } from '../insegnante.model';
import { InsegnanteService } from '../service/insegnante.service';
import { ICorso } from 'app/entities/corso/corso.model';
import { CorsoService } from 'app/entities/corso/service/corso.service';

@Component({
  selector: 'jhi-insegnante-update',
  templateUrl: './insegnante-update.component.html',
})
export class InsegnanteUpdateComponent implements OnInit {
  isSaving = false;

  corsosSharedCollection: ICorso[] = [];

  editForm = this.fb.group({
    id: [],
    nomeInsegnante: [],
    corsos: [],
  });

  constructor(
    protected insegnanteService: InsegnanteService,
    protected corsoService: CorsoService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ insegnante }) => {
      this.updateForm(insegnante);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const insegnante = this.createFromForm();
    if (insegnante.id !== undefined) {
      this.subscribeToSaveResponse(this.insegnanteService.update(insegnante));
    } else {
      this.subscribeToSaveResponse(this.insegnanteService.create(insegnante));
    }
  }

  trackCorsoById(index: number, item: ICorso): number {
    return item.id!;
  }

  getSelectedCorso(option: ICorso, selectedVals?: ICorso[]): ICorso {
    if (selectedVals) {
      for (const selectedVal of selectedVals) {
        if (option.id === selectedVal.id) {
          return selectedVal;
        }
      }
    }
    return option;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IInsegnante>>): void {
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

  protected updateForm(insegnante: IInsegnante): void {
    this.editForm.patchValue({
      id: insegnante.id,
      nomeInsegnante: insegnante.nomeInsegnante,
      corsos: insegnante.corsos,
    });

    this.corsosSharedCollection = this.corsoService.addCorsoToCollectionIfMissing(
      this.corsosSharedCollection,
      ...(insegnante.corsos ?? [])
    );
  }

  protected loadRelationshipsOptions(): void {
    this.corsoService
      .query()
      .pipe(map((res: HttpResponse<ICorso[]>) => res.body ?? []))
      .pipe(
        map((corsos: ICorso[]) => this.corsoService.addCorsoToCollectionIfMissing(corsos, ...(this.editForm.get('corsos')!.value ?? [])))
      )
      .subscribe((corsos: ICorso[]) => (this.corsosSharedCollection = corsos));
  }

  protected createFromForm(): IInsegnante {
    return {
      ...new Insegnante(),
      id: this.editForm.get(['id'])!.value,
      nomeInsegnante: this.editForm.get(['nomeInsegnante'])!.value,
      corsos: this.editForm.get(['corsos'])!.value,
    };
  }
}
