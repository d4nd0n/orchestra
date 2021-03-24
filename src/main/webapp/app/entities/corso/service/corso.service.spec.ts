import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ICorso, Corso } from '../corso.model';

import { CorsoService } from './corso.service';

describe('Service Tests', () => {
  describe('Corso Service', () => {
    let service: CorsoService;
    let httpMock: HttpTestingController;
    let elemDefault: ICorso;
    let expectedResult: ICorso | ICorso[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(CorsoService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 0,
        anno: 'AAAAAAA',
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign({}, elemDefault);

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a Corso', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new Corso()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Corso', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            anno: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a Corso', () => {
        const patchObject = Object.assign(
          {
            anno: 'BBBBBB',
          },
          new Corso()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Corso', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            anno: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a Corso', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addCorsoToCollectionIfMissing', () => {
        it('should add a Corso to an empty array', () => {
          const corso: ICorso = { id: 123 };
          expectedResult = service.addCorsoToCollectionIfMissing([], corso);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(corso);
        });

        it('should not add a Corso to an array that contains it', () => {
          const corso: ICorso = { id: 123 };
          const corsoCollection: ICorso[] = [
            {
              ...corso,
            },
            { id: 456 },
          ];
          expectedResult = service.addCorsoToCollectionIfMissing(corsoCollection, corso);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Corso to an array that doesn't contain it", () => {
          const corso: ICorso = { id: 123 };
          const corsoCollection: ICorso[] = [{ id: 456 }];
          expectedResult = service.addCorsoToCollectionIfMissing(corsoCollection, corso);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(corso);
        });

        it('should add only unique Corso to an array', () => {
          const corsoArray: ICorso[] = [{ id: 123 }, { id: 456 }, { id: 37184 }];
          const corsoCollection: ICorso[] = [{ id: 123 }];
          expectedResult = service.addCorsoToCollectionIfMissing(corsoCollection, ...corsoArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const corso: ICorso = { id: 123 };
          const corso2: ICorso = { id: 456 };
          expectedResult = service.addCorsoToCollectionIfMissing([], corso, corso2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(corso);
          expect(expectedResult).toContain(corso2);
        });

        it('should accept null and undefined values', () => {
          const corso: ICorso = { id: 123 };
          expectedResult = service.addCorsoToCollectionIfMissing([], null, corso, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(corso);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
