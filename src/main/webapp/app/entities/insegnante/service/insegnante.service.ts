import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IInsegnante, getInsegnanteIdentifier } from '../insegnante.model';

export type EntityResponseType = HttpResponse<IInsegnante>;
export type EntityArrayResponseType = HttpResponse<IInsegnante[]>;

@Injectable({ providedIn: 'root' })
export class InsegnanteService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/insegnantes');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(insegnante: IInsegnante): Observable<EntityResponseType> {
    return this.http.post<IInsegnante>(this.resourceUrl, insegnante, { observe: 'response' });
  }

  update(insegnante: IInsegnante): Observable<EntityResponseType> {
    return this.http.put<IInsegnante>(`${this.resourceUrl}/${getInsegnanteIdentifier(insegnante) as number}`, insegnante, {
      observe: 'response',
    });
  }

  partialUpdate(insegnante: IInsegnante): Observable<EntityResponseType> {
    return this.http.patch<IInsegnante>(`${this.resourceUrl}/${getInsegnanteIdentifier(insegnante) as number}`, insegnante, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IInsegnante>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IInsegnante[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addInsegnanteToCollectionIfMissing(
    insegnanteCollection: IInsegnante[],
    ...insegnantesToCheck: (IInsegnante | null | undefined)[]
  ): IInsegnante[] {
    const insegnantes: IInsegnante[] = insegnantesToCheck.filter(isPresent);
    if (insegnantes.length > 0) {
      const insegnanteCollectionIdentifiers = insegnanteCollection.map(insegnanteItem => getInsegnanteIdentifier(insegnanteItem)!);
      const insegnantesToAdd = insegnantes.filter(insegnanteItem => {
        const insegnanteIdentifier = getInsegnanteIdentifier(insegnanteItem);
        if (insegnanteIdentifier == null || insegnanteCollectionIdentifiers.includes(insegnanteIdentifier)) {
          return false;
        }
        insegnanteCollectionIdentifiers.push(insegnanteIdentifier);
        return true;
      });
      return [...insegnantesToAdd, ...insegnanteCollection];
    }
    return insegnanteCollection;
  }
}
