import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ICorso, getCorsoIdentifier } from '../corso.model';

export type EntityResponseType = HttpResponse<ICorso>;
export type EntityArrayResponseType = HttpResponse<ICorso[]>;

@Injectable({ providedIn: 'root' })
export class CorsoService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/corsos');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(corso: ICorso): Observable<EntityResponseType> {
    return this.http.post<ICorso>(this.resourceUrl, corso, { observe: 'response' });
  }

  update(corso: ICorso): Observable<EntityResponseType> {
    return this.http.put<ICorso>(`${this.resourceUrl}/${getCorsoIdentifier(corso) as number}`, corso, { observe: 'response' });
  }

  partialUpdate(corso: ICorso): Observable<EntityResponseType> {
    return this.http.patch<ICorso>(`${this.resourceUrl}/${getCorsoIdentifier(corso) as number}`, corso, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ICorso>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ICorso[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addCorsoToCollectionIfMissing(corsoCollection: ICorso[], ...corsosToCheck: (ICorso | null | undefined)[]): ICorso[] {
    const corsos: ICorso[] = corsosToCheck.filter(isPresent);
    if (corsos.length > 0) {
      const corsoCollectionIdentifiers = corsoCollection.map(corsoItem => getCorsoIdentifier(corsoItem)!);
      const corsosToAdd = corsos.filter(corsoItem => {
        const corsoIdentifier = getCorsoIdentifier(corsoItem);
        if (corsoIdentifier == null || corsoCollectionIdentifiers.includes(corsoIdentifier)) {
          return false;
        }
        corsoCollectionIdentifiers.push(corsoIdentifier);
        return true;
      });
      return [...corsosToAdd, ...corsoCollection];
    }
    return corsoCollection;
  }
}
