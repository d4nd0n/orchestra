import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IFoto, getFotoIdentifier } from '../foto.model';

export type EntityResponseType = HttpResponse<IFoto>;
export type EntityArrayResponseType = HttpResponse<IFoto[]>;

@Injectable({ providedIn: 'root' })
export class FotoService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/fotos');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(foto: IFoto): Observable<EntityResponseType> {
    return this.http.post<IFoto>(this.resourceUrl, foto, { observe: 'response' });
  }

  update(foto: IFoto): Observable<EntityResponseType> {
    return this.http.put<IFoto>(`${this.resourceUrl}/${getFotoIdentifier(foto) as number}`, foto, { observe: 'response' });
  }

  partialUpdate(foto: IFoto): Observable<EntityResponseType> {
    return this.http.patch<IFoto>(`${this.resourceUrl}/${getFotoIdentifier(foto) as number}`, foto, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IFoto>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IFoto[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addFotoToCollectionIfMissing(fotoCollection: IFoto[], ...fotosToCheck: (IFoto | null | undefined)[]): IFoto[] {
    const fotos: IFoto[] = fotosToCheck.filter(isPresent);
    if (fotos.length > 0) {
      const fotoCollectionIdentifiers = fotoCollection.map(fotoItem => getFotoIdentifier(fotoItem)!);
      const fotosToAdd = fotos.filter(fotoItem => {
        const fotoIdentifier = getFotoIdentifier(fotoItem);
        if (fotoIdentifier == null || fotoCollectionIdentifiers.includes(fotoIdentifier)) {
          return false;
        }
        fotoCollectionIdentifiers.push(fotoIdentifier);
        return true;
      });
      return [...fotosToAdd, ...fotoCollection];
    }
    return fotoCollection;
  }
}
