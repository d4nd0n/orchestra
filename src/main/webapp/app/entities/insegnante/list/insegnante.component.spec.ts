import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { InsegnanteService } from '../service/insegnante.service';

import { InsegnanteComponent } from './insegnante.component';

describe('Component Tests', () => {
  describe('Insegnante Management Component', () => {
    let comp: InsegnanteComponent;
    let fixture: ComponentFixture<InsegnanteComponent>;
    let service: InsegnanteService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [InsegnanteComponent],
      })
        .overrideTemplate(InsegnanteComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(InsegnanteComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(InsegnanteService);

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
      expect(comp.insegnantes?.[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
