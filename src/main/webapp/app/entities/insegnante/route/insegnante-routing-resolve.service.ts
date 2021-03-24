import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IInsegnante, Insegnante } from '../insegnante.model';
import { InsegnanteService } from '../service/insegnante.service';

@Injectable({ providedIn: 'root' })
export class InsegnanteRoutingResolveService implements Resolve<IInsegnante> {
  constructor(protected service: InsegnanteService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IInsegnante> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((insegnante: HttpResponse<Insegnante>) => {
          if (insegnante.body) {
            return of(insegnante.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Insegnante());
  }
}
