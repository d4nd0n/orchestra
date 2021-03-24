import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { FotoService } from '../service/foto.service';

import { FotoComponent } from './foto.component';

describe('Component Tests', () => {
  describe('Foto Management Component', () => {
    let comp: FotoComponent;
    let fixture: ComponentFixture<FotoComponent>;
    let service: FotoService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [FotoComponent],
      })
        .overrideTemplate(FotoComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(FotoComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(FotoService);

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
      expect(comp.fotos?.[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
