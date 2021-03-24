import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { CorsoDetailComponent } from './corso-detail.component';

describe('Component Tests', () => {
  describe('Corso Management Detail Component', () => {
    let comp: CorsoDetailComponent;
    let fixture: ComponentFixture<CorsoDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [CorsoDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ corso: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(CorsoDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(CorsoDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load corso on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.corso).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
