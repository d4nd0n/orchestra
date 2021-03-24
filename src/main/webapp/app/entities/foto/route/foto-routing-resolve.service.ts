import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IFoto, Foto } from '../foto.model';
import { FotoService } from '../service/foto.service';

@Injectable({ providedIn: 'root' })
export class FotoRoutingResolveService implements Resolve<IFoto> {
  constructor(protected service: FotoService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IFoto> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((foto: HttpResponse<Foto>) => {
          if (foto.body) {
            return of(foto.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Foto());
  }
}
