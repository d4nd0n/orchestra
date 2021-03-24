jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { InsegnanteService } from '../service/insegnante.service';
import { IInsegnante, Insegnante } from '../insegnante.model';
import { ICorso } from 'app/entities/corso/corso.model';
import { CorsoService } from 'app/entities/corso/service/corso.service';

import { InsegnanteUpdateComponent } from './insegnante-update.component';

describe('Component Tests', () => {
  describe('Insegnante Management Update Component', () => {
    let comp: InsegnanteUpdateComponent;
    let fixture: ComponentFixture<InsegnanteUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let insegnanteService: InsegnanteService;
    let corsoService: CorsoService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [InsegnanteUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(InsegnanteUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(InsegnanteUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      insegnanteService = TestBed.inject(InsegnanteService);
      corsoService = TestBed.inject(CorsoService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Corso query and add missing value', () => {
        const insegnante: IInsegnante = { id: 456 };
        const corsos: ICorso[] = [{ id: 78435 }];
        insegnante.corsos = corsos;

        const corsoCollection: ICorso[] = [{ id: 82560 }];
        spyOn(corsoService, 'query').and.returnValue(of(new HttpResponse({ body: corsoCollection })));
        const additionalCorsos = [...corsos];
        const expectedCollection: ICorso[] = [...additionalCorsos, ...corsoCollection];
        spyOn(corsoService, 'addCorsoToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ insegnante });
        comp.ngOnInit();

        expect(corsoService.query).toHaveBeenCalled();
        expect(corsoService.addCorsoToCollectionIfMissing).toHaveBeenCalledWith(corsoCollection, ...additionalCorsos);
        expect(comp.corsosSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const insegnante: IInsegnante = { id: 456 };
        const corsos: ICorso = { id: 52226 };
        insegnante.corsos = [corsos];

        activatedRoute.data = of({ insegnante });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(insegnante));
        expect(comp.corsosSharedCollection).toContain(corsos);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const insegnante = { id: 123 };
        spyOn(insegnanteService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ insegnante });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: insegnante }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(insegnanteService.update).toHaveBeenCalledWith(insegnante);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const insegnante = new Insegnante();
        spyOn(insegnanteService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ insegnante });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: insegnante }));
        saveSubject.complete();

        // THEN
        expect(insegnanteService.create).toHaveBeenCalledWith(insegnante);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const insegnante = { id: 123 };
        spyOn(insegnanteService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ insegnante });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(insegnanteService.update).toHaveBeenCalledWith(insegnante);
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
