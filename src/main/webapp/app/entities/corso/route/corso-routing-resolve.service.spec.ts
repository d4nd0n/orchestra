jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { ICorso, Corso } from '../corso.model';
import { CorsoService } from '../service/corso.service';

import { CorsoRoutingResolveService } from './corso-routing-resolve.service';

describe('Service Tests', () => {
  describe('Corso routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: CorsoRoutingResolveService;
    let service: CorsoService;
    let resultCorso: ICorso | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(CorsoRoutingResolveService);
      service = TestBed.inject(CorsoService);
      resultCorso = undefined;
    });

    describe('resolve', () => {
      it('should return ICorso returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultCorso = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultCorso).toEqual({ id: 123 });
      });

      it('should return new ICorso if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultCorso = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultCorso).toEqual(new Corso());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        spyOn(service, 'find').and.returnValue(of(new HttpResponse({ body: null })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultCorso = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultCorso).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
