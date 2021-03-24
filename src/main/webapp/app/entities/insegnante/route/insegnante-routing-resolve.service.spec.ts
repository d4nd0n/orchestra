jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IInsegnante, Insegnante } from '../insegnante.model';
import { InsegnanteService } from '../service/insegnante.service';

import { InsegnanteRoutingResolveService } from './insegnante-routing-resolve.service';

describe('Service Tests', () => {
  describe('Insegnante routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: InsegnanteRoutingResolveService;
    let service: InsegnanteService;
    let resultInsegnante: IInsegnante | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(InsegnanteRoutingResolveService);
      service = TestBed.inject(InsegnanteService);
      resultInsegnante = undefined;
    });

    describe('resolve', () => {
      it('should return IInsegnante returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultInsegnante = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultInsegnante).toEqual({ id: 123 });
      });

      it('should return new IInsegnante if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultInsegnante = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultInsegnante).toEqual(new Insegnante());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        spyOn(service, 'find').and.returnValue(of(new HttpResponse({ body: null })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultInsegnante = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultInsegnante).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
