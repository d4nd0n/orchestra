import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IConcerto, Concerto } from '../concerto.model';
import { ConcertoService } from '../service/concerto.service';

@Injectable({ providedIn: 'root' })
export class ConcertoRoutingResolveService implements Resolve<IConcerto> {
  constructor(protected service: ConcertoService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IConcerto> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((concerto: HttpResponse<Concerto>) => {
          if (concerto.body) {
            return of(concerto.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Concerto());
  }
}
