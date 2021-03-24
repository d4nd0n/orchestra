jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { ClienteService } from '../service/cliente.service';
import { ICliente, Cliente } from '../cliente.model';
import { ICorso } from 'app/entities/corso/corso.model';
import { CorsoService } from 'app/entities/corso/service/corso.service';

import { ClienteUpdateComponent } from './cliente-update.component';

describe('Component Tests', () => {
  describe('Cliente Management Update Component', () => {
    let comp: ClienteUpdateComponent;
    let fixture: ComponentFixture<ClienteUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let clienteService: ClienteService;
    let corsoService: CorsoService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [ClienteUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(ClienteUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ClienteUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      clienteService = TestBed.inject(ClienteService);
      corsoService = TestBed.inject(CorsoService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Corso query and add missing value', () => {
        const cliente: ICliente = { id: 456 };
        const corsos: ICorso[] = [{ id: 69007 }];
        cliente.corsos = corsos;

        const corsoCollection: ICorso[] = [{ id: 41214 }];
        spyOn(corsoService, 'query').and.returnValue(of(new HttpResponse({ body: corsoCollection })));
        const additionalCorsos = [...corsos];
        const expectedCollection: ICorso[] = [...additionalCorsos, ...corsoCollection];
        spyOn(corsoService, 'addCorsoToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ cliente });
        comp.ngOnInit();

        expect(corsoService.query).toHaveBeenCalled();
        expect(corsoService.addCorsoToCollectionIfMissing).toHaveBeenCalledWith(corsoCollection, ...additionalCorsos);
        expect(comp.corsosSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const cliente: ICliente = { id: 456 };
        const corsos: ICorso = { id: 3379 };
        cliente.corsos = [corsos];

        activatedRoute.data = of({ cliente });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(cliente));
        expect(comp.corsosSharedCollection).toContain(corsos);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const cliente = { id: 123 };
        spyOn(clienteService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ cliente });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: cliente }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(clienteService.update).toHaveBeenCalledWith(cliente);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const cliente = new Cliente();
        spyOn(clienteService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ cliente });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: cliente }));
        saveSubject.complete();

        // THEN
        expect(clienteService.create).toHaveBeenCalledWith(cliente);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const cliente = { id: 123 };
        spyOn(clienteService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ cliente });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(clienteService.update).toHaveBeenCalledWith(cliente);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackCorsoById', () => {
        it('Should return tracked Corso primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackCorsoById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });

    describe('Getting selected relationships', () => {
      describe('getSelectedCorso', () => {
        it('Should return option if no Corso is selected', () => {
          const option = { id: 123 };
          const result = comp.getSelectedCorso(option);
          expect(result === option).toEqual(true);
        });

        it('Should return selected Corso for according option', () => {
          const option = { id: 123 };
          const selected = { id: 123 };
          const selected2 = { id: 456 };
          const result = comp.getSelectedCorso(option, [selected2, selected]);
          expect(result === selected).toEqual(true);
          expect(result === selected2).toEqual(false);
          expect(result === option).toEqual(false);
        });

        it('Should return option if this Corso is not selected', () => {
          const option = { id: 123 };
          const selected = { id: 456 };
          const result = comp.getSelectedCorso(option, [selected]);
          expect(result === option).toEqual(true);
          expect(result === selected).toEqual(false);
        });
      });
    });
  });
});
