jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { ConcertoService } from '../service/concerto.service';
import { IConcerto, Concerto } from '../concerto.model';
import { ICorso } from 'app/entities/corso/corso.model';
import { CorsoService } from 'app/entities/corso/service/corso.service';

import { ConcertoUpdateComponent } from './concerto-update.component';

describe('Component Tests', () => {
  describe('Concerto Management Update Component', () => {
    let comp: ConcertoUpdateComponent;
    let fixture: ComponentFixture<ConcertoUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let concertoService: ConcertoService;
    let corsoService: CorsoService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [ConcertoUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(ConcertoUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ConcertoUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      concertoService = TestBed.inject(ConcertoService);
      corsoService = TestBed.inject(CorsoService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Corso query and add missing value', () => {
        const concerto: IConcerto = { id: 456 };
        const corso: ICorso = { id: 66424 };
        concerto.corso = corso;

        const corsoCollection: ICorso[] = [{ id: 75098 }];
        spyOn(corsoService, 'query').and.returnValue(of(new HttpResponse({ body: corsoCollection })));
        const additionalCorsos = [corso];
        const expectedCollection: ICorso[] = [...additionalCorsos, ...corsoCollection];
        spyOn(corsoService, 'addCorsoToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ concerto });
        comp.ngOnInit();

        expect(corsoService.query).toHaveBeenCalled();
        expect(corsoService.addCorsoToCollectionIfMissing).toHaveBeenCalledWith(corsoCollection, ...additionalCorsos);
        expect(comp.corsosSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const concerto: IConcerto = { id: 456 };
        const corso: ICorso = { id: 5146 };
        concerto.corso = corso;

        activatedRoute.data = of({ concerto });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(concerto));
        expect(comp.corsosSharedCollection).toContain(corso);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const concerto = { id: 123 };
        spyOn(concertoService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ concerto });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: concerto }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(concertoService.update).toHaveBeenCalledWith(concerto);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const concerto = new Concerto();
        spyOn(concertoService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ concerto });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: concerto }));
        saveSubject.complete();

        // THEN
        expect(concertoService.create).toHaveBeenCalledWith(concerto);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const concerto = { id: 123 };
        spyOn(concertoService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ concerto });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(concertoService.update).toHaveBeenCalledWith(concerto);
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
  });
});
