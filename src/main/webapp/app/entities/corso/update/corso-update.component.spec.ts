jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { CorsoService } from '../service/corso.service';
import { ICorso, Corso } from '../corso.model';

import { CorsoUpdateComponent } from './corso-update.component';

describe('Component Tests', () => {
  describe('Corso Management Update Component', () => {
    let comp: CorsoUpdateComponent;
    let fixture: ComponentFixture<CorsoUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let corsoService: CorsoService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [CorsoUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(CorsoUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(CorsoUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      corsoService = TestBed.inject(CorsoService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should update editForm', () => {
        const corso: ICorso = { id: 456 };

        activatedRoute.data = of({ corso });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(corso));
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const corso = { id: 123 };
        spyOn(corsoService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ corso });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: corso }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(corsoService.update).toHaveBeenCalledWith(corso);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const corso = new Corso();
        spyOn(corsoService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ corso });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: corso }));
        saveSubject.complete();

        // THEN
        expect(corsoService.create).toHaveBeenCalledWith(corso);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const corso = { id: 123 };
        spyOn(corsoService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ corso });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(corsoService.update).toHaveBeenCalledWith(corso);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });
  });
});
