import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ICliente, Cliente } from '../cliente.model';
import { ClienteService } from '../service/cliente.service';
import { ICorso } from 'app/entities/corso/corso.model';
import { CorsoService } from 'app/entities/corso/service/corso.service';

@Component({
  selector: 'jhi-cliente-update',
  templateUrl: './cliente-update.component.html',
})
export class ClienteUpdateComponent implements OnInit {
  isSaving = false;

  corsosSharedCollection: ICorso[] = [];

  editForm = this.fb.group({
    id: [],
    nomeCliente: [],
    corsos: [],
  });

  constructor(
    protected clienteService: ClienteService,
    protected corsoService: CorsoService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ cliente }) => {
      this.updateForm(cliente);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const cliente = this.createFromForm();
    if (cliente.id !== undefined) {
      this.subscribeToSaveResponse(this.clienteService.update(cliente));
    } else {
      this.subscribeToSaveResponse(this.clienteService.create(cliente));
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

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICliente>>): void {
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

  protected updateForm(cliente: ICliente): void {
    this.editForm.patchValue({
      id: cliente.id,
      nomeCliente: cliente.nomeCliente,
      corsos: cliente.corsos,
    });

    this.corsosSharedCollection = this.corsoService.addCorsoToCollectionIfMissing(this.corsosSharedCollection, ...(cliente.corsos ?? []));
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

  protected createFromForm(): ICliente {
    return {
      ...new Cliente(),
      id: this.editForm.get(['id'])!.value,
      nomeCliente: this.editForm.get(['nomeCliente'])!.value,
      corsos: this.editForm.get(['corsos'])!.value,
    };
  }
}
