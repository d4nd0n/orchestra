import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { CorsoService } from '../service/corso.service';

import { CorsoComponent } from './corso.component';

describe('Component Tests', () => {
  describe('Corso Management Component', () => {
    let comp: CorsoComponent;
    let fixture: ComponentFixture<CorsoComponent>;
    let service: CorsoService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [CorsoComponent],
      })
        .overrideTemplate(CorsoComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(CorsoComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(CorsoService);

      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [{ id: 123 }],
            headers,
          })
        )
      );
    });

    it('Should call load all on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.corsos?.[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
