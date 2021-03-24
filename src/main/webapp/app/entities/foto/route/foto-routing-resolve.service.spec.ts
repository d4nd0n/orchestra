jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IFoto, Foto } from '../foto.model';
import { FotoService } from '../service/foto.service';

import { FotoRoutingResolveService } from './foto-routing-resolve.service';

describe('Service Tests', () => {
  describe('Foto routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: FotoRoutingResolveService;
    let service: FotoService;
    let resultFoto: IFoto | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(FotoRoutingResolveService);
      service = TestBed.inject(FotoService);
      resultFoto = undefined;
    });

    describe('resolve', () => {
      it('should return IFoto returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultFoto = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultFoto).toEqual({ id: 123 });
      });

      it('should return new IFoto if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultFoto = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultFoto).toEqual(new Foto());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        spyOn(service, 'find').and.returnValue(of(new HttpResponse({ body: null })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultFoto = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultFoto).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
