import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IInsegnante, Insegnante } from '../insegnante.model';

import { InsegnanteService } from './insegnante.service';

describe('Service Tests', () => {
  describe('Insegnante Service', () => {
    let service: InsegnanteService;
    let httpMock: HttpTestingController;
    let elemDefault: IInsegnante;
    let expectedResult: IInsegnante | IInsegnante[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(InsegnanteService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 0,
        nomeInsegnante: 'AAAAAAA',
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

      it('should create a Insegnante', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new Insegnante()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Insegnante', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            nomeInsegnante: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a Insegnante', () => {
        const patchObject = Object.assign(
          {
            nomeInsegnante: 'BBBBBB',
          },
          new Insegnante()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Insegnante', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            nomeInsegnante: 'BBBBBB',
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

      it('should delete a Insegnante', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addInsegnanteToCollectionIfMissing', () => {
        it('should add a Insegnante to an empty array', () => {
          const insegnante: IInsegnante = { id: 123 };
          expectedResult = service.addInsegnanteToCollectionIfMissing([], insegnante);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(insegnante);
        });

        it('should not add a Insegnante to an array that contains it', () => {
          const insegnante: IInsegnante = { id: 123 };
          const insegnanteCollection: IInsegnante[] = [
            {
              ...insegnante,
            },
            { id: 456 },
          ];
          expectedResult = service.addInsegnanteToCollectionIfMissing(insegnanteCollection, insegnante);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Insegnante to an array that doesn't contain it", () => {
          const insegnante: IInsegnante = { id: 123 };
          const insegnanteCollection: IInsegnante[] = [{ id: 456 }];
          expectedResult = service.addInsegnanteToCollectionIfMissing(insegnanteCollection, insegnante);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(insegnante);
        });

        it('should add only unique Insegnante to an array', () => {
          const insegnanteArray: IInsegnante[] = [{ id: 123 }, { id: 456 }, { id: 69498 }];
          const insegnanteCollection: IInsegnante[] = [{ id: 123 }];
          expectedResult = service.addInsegnanteToCollectionIfMissing(insegnanteCollection, ...insegnanteArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const insegnante: IInsegnante = { id: 123 };
          const insegnante2: IInsegnante = { id: 456 };
          expectedResult = service.addInsegnanteToCollectionIfMissing([], insegnante, insegnante2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(insegnante);
          expect(expectedResult).toContain(insegnante2);
        });

        it('should accept null and undefined values', () => {
          const insegnante: IInsegnante = { id: 123 };
          expectedResult = service.addInsegnanteToCollectionIfMissing([], null, insegnante, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(insegnante);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
