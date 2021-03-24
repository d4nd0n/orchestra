jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IVideo, Video } from '../video.model';
import { VideoService } from '../service/video.service';

import { VideoRoutingResolveService } from './video-routing-resolve.service';

describe('Service Tests', () => {
  describe('Video routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: VideoRoutingResolveService;
    let service: VideoService;
    let resultVideo: IVideo | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(VideoRoutingResolveService);
      service = TestBed.inject(VideoService);
      resultVideo = undefined;
    });

    describe('resolve', () => {
      it('should return IVideo returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultVideo = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultVideo).toEqual({ id: 123 });
      });

      it('should return new IVideo if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultVideo = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultVideo).toEqual(new Video());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        spyOn(service, 'find').and.returnValue(of(new HttpResponse({ body: null })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultVideo = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultVideo).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
