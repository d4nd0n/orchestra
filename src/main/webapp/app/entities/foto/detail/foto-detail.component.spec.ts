import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { FotoDetailComponent } from './foto-detail.component';

describe('Component Tests', () => {
  describe('Foto Management Detail Component', () => {
    let comp: FotoDetailComponent;
    let fixture: ComponentFixture<FotoDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [FotoDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ foto: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(FotoDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(FotoDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load foto on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.foto).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
