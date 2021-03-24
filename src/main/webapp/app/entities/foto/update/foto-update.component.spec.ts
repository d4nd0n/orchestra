jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { FotoService } from '../service/foto.service';
import { IFoto, Foto } from '../foto.model';
import { IConcerto } from 'app/entities/concerto/concerto.model';
import { ConcertoService } from 'app/entities/concerto/service/concerto.service';

import { FotoUpdateComponent } from './foto-update.component';

describe('Component Tests', () => {
  describe('Foto Management Update Component', () => {
    let comp: FotoUpdateComponent;
    let fixture: ComponentFixture<FotoUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let fotoService: FotoService;
    let concertoService: ConcertoService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [FotoUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(FotoUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(FotoUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      fotoService = TestBed.inject(FotoService);
      concertoService = TestBed.inject(ConcertoService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Concerto query and add missing value', () => {
        const foto: IFoto = { id: 456 };
        const concerto: IConcerto = { id: 96937 };
        foto.concerto = concerto;

        const concertoCollection: IConcerto[] = [{ id: 38928 }];
        spyOn(concertoService, 'query').and.returnValue(of(new HttpResponse({ body: concertoCollection })));
        const additionalConcertos = [concerto];
        const expectedCollection: IConcerto[] = [...additionalConcertos, ...concertoCollection];
        spyOn(concertoService, 'addConcertoToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ foto });
        comp.ngOnInit();

        expect(concertoService.query).toHaveBeenCalled();
        expect(concertoService.addConcertoToCollectionIfMissing).toHaveBeenCalledWith(concertoCollection, ...additionalConcertos);
        expect(comp.concertosSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const foto: IFoto = { id: 456 };
        const concerto: IConcerto = { id: 80280 };
        foto.concerto = concerto;

        activatedRoute.data = of({ foto });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(foto));
        expect(comp.concertosSharedCollection).toContain(concerto);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const foto = { id: 123 };
        spyOn(fotoService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ foto });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: foto }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(fotoService.update).toHaveBeenCalledWith(foto);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const foto = new Foto();
        spyOn(fotoService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ foto });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: foto }));
        saveSubject.complete();

        // THEN
        expect(fotoService.create).toHaveBeenCalledWith(foto);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const foto = { id: 123 };
        spyOn(fotoService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ foto });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(fotoService.update).toHaveBeenCalledWith(foto);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackConcertoById', () => {
        it('Should return tracked Concerto primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackConcertoById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
