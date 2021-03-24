import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { InsegnanteDetailComponent } from './insegnante-detail.component';

describe('Component Tests', () => {
  describe('Insegnante Management Detail Component', () => {
    let comp: InsegnanteDetailComponent;
    let fixture: ComponentFixture<InsegnanteDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [InsegnanteDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ insegnante: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(InsegnanteDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(InsegnanteDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load insegnante on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.insegnante).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
