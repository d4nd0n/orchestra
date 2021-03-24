import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ConcertoDetailComponent } from './concerto-detail.component';

describe('Component Tests', () => {
  describe('Concerto Management Detail Component', () => {
    let comp: ConcertoDetailComponent;
    let fixture: ComponentFixture<ConcertoDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [ConcertoDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ concerto: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(ConcertoDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(ConcertoDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load concerto on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.concerto).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
