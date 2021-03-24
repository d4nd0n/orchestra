import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { ICorso, Corso } from '../corso.model';
import { CorsoService } from '../service/corso.service';

@Component({
  selector: 'jhi-corso-update',
  templateUrl: './corso-update.component.html',
})
export class CorsoUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    anno: [],
  });

  constructor(protected corsoService: CorsoService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ corso }) => {
      this.updateForm(corso);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const corso = this.createFromForm();
    if (corso.id !== undefined) {
      this.subscribeToSaveResponse(this.corsoService.update(corso));
    } else {
      this.subscribeToSaveResponse(this.corsoService.create(corso));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICorso>>): void {
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

  protected updateForm(corso: ICorso): void {
    this.editForm.patchValue({
      id: corso.id,
      anno: corso.anno,
    });
  }

  protected createFromForm(): ICorso {
    return {
      ...new Corso(),
      id: this.editForm.get(['id'])!.value,
      anno: this.editForm.get(['anno'])!.value,
    };
  }
}
