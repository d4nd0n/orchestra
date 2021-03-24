jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IConcerto, Concerto } from '../concerto.model';
import { ConcertoService } from '../service/concerto.service';

import { ConcertoRoutingResolveService } from './concerto-routing-resolve.service';

describe('Service Tests', () => {
  describe('Concerto routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: ConcertoRoutingResolveService;
    let service: ConcertoService;
    let resultConcerto: IConcerto | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(ConcertoRoutingResolveService);
      service = TestBed.inject(ConcertoService);
      resultConcerto = undefined;
    });

    describe('resolve', () => {
      it('should return IConcerto returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultConcerto = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultConcerto).toEqual({ id: 123 });
      });

      it('should return new IConcerto if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultConcerto = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultConcerto).toEqual(new Concerto());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        spyOn(service, 'find').and.returnValue(of(new HttpResponse({ body: null })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultConcerto = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultConcerto).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
