import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ICorso, Corso } from '../corso.model';
import { CorsoService } from '../service/corso.service';

@Injectable({ providedIn: 'root' })
export class CorsoRoutingResolveService implements Resolve<ICorso> {
  constructor(protected service: CorsoService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ICorso> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((corso: HttpResponse<Corso>) => {
          if (corso.body) {
            return of(corso.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Corso());
  }
}
