import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IConcerto, getConcertoIdentifier } from '../concerto.model';

export type EntityResponseType = HttpResponse<IConcerto>;
export type EntityArrayResponseType = HttpResponse<IConcerto[]>;

@Injectable({ providedIn: 'root' })
export class ConcertoService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/concertos');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(concerto: IConcerto): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(concerto);
    return this.http
      .post<IConcerto>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(concerto: IConcerto): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(concerto);
    return this.http
      .put<IConcerto>(`${this.resourceUrl}/${getConcertoIdentifier(concerto) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(concerto: IConcerto): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(concerto);
    return this.http
      .patch<IConcerto>(`${this.resourceUrl}/${getConcertoIdentifier(concerto) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IConcerto>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IConcerto[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addConcertoToCollectionIfMissing(concertoCollection: IConcerto[], ...concertosToCheck: (IConcerto | null | undefined)[]): IConcerto[] {
    const concertos: IConcerto[] = concertosToCheck.filter(isPresent);
    if (concertos.length > 0) {
      const concertoCollectionIdentifiers = concertoCollection.map(concertoItem => getConcertoIdentifier(concertoItem)!);
      const concertosToAdd = concertos.filter(concertoItem => {
        const concertoIdentifier = getConcertoIdentifier(concertoItem);
        if (concertoIdentifier == null || concertoCollectionIdentifiers.includes(concertoIdentifier)) {
          return false;
        }
        concertoCollectionIdentifiers.push(concertoIdentifier);
        return true;
      });
      return [...concertosToAdd, ...concertoCollection];
    }
    return concertoCollection;
  }

  protected convertDateFromClient(concerto: IConcerto): IConcerto {
    return Object.assign({}, concerto, {
      date: concerto.date?.isValid() ? concerto.date.format(DATE_FORMAT) : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.date = res.body.date ? dayjs(res.body.date) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((concerto: IConcerto) => {
        concerto.date = concerto.date ? dayjs(concerto.date) : undefined;
      });
    }
    return res;
  }
}
