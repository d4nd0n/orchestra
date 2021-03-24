import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as dayjs from 'dayjs';

import { DATE_FORMAT } from 'app/config/input.constants';
import { IConcerto, Concerto } from '../concerto.model';

import { ConcertoService } from './concerto.service';

describe('Service Tests', () => {
  describe('Concerto Service', () => {
    let service: ConcertoService;
    let httpMock: HttpTestingController;
    let elemDefault: IConcerto;
    let expectedResult: IConcerto | IConcerto[] | boolean | null;
    let currentDate: dayjs.Dayjs;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(ConcertoService);
      httpMock = TestBed.inject(HttpTestingController);
      currentDate = dayjs();

      elemDefault = {
        id: 0,
        date: currentDate,
        hours: 'AAAAAAA',
        location: 'AAAAAAA',
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign(
          {
            date: currentDate.format(DATE_FORMAT),
          },
          elemDefault
        );

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a Concerto', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
            date: currentDate.format(DATE_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            date: currentDate,
          },
          returnedFromService
        );

        service.create(new Concerto()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Concerto', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            date: currentDate.format(DATE_FORMAT),
            hours: 'BBBBBB',
            location: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            date: currentDate,
          },
          returnedFromService
        );

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a Concerto', () => {
        const patchObject = Object.assign(
          {
            location: 'BBBBBB',
          },
          new Concerto()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign(
          {
            date: currentDate,
          },
          returnedFromService
        );

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Concerto', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            date: currentDate.format(DATE_FORMAT),
            hours: 'BBBBBB',
            location: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            date: currentDate,
          },
          returnedFromService
        );

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a Concerto', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addConcertoToCollectionIfMissing', () => {
        it('should add a Concerto to an empty array', () => {
          const concerto: IConcerto = { id: 123 };
          expectedResult = service.addConcertoToCollectionIfMissing([], concerto);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(concerto);
        });

        it('should not add a Concerto to an array that contains it', () => {
          const concerto: IConcerto = { id: 123 };
          const concertoCollection: IConcerto[] = [
            {
              ...concerto,
            },
            { id: 456 },
          ];
          expectedResult = service.addConcertoToCollectionIfMissing(concertoCollection, concerto);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Concerto to an array that doesn't contain it", () => {
          const concerto: IConcerto = { id: 123 };
          const concertoCollection: IConcerto[] = [{ id: 456 }];
          expectedResult = service.addConcertoToCollectionIfMissing(concertoCollection, concerto);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(concerto);
        });

        it('should add only unique Concerto to an array', () => {
          const concertoArray: IConcerto[] = [{ id: 123 }, { id: 456 }, { id: 15672 }];
          const concertoCollection: IConcerto[] = [{ id: 123 }];
          expectedResult = service.addConcertoToCollectionIfMissing(concertoCollection, ...concertoArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const concerto: IConcerto = { id: 123 };
          const concerto2: IConcerto = { id: 456 };
          expectedResult = service.addConcertoToCollectionIfMissing([], concerto, concerto2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(concerto);
          expect(expectedResult).toContain(concerto2);
        });

        it('should accept null and undefined values', () => {
          const concerto: IConcerto = { id: 123 };
          expectedResult = service.addConcertoToCollectionIfMissing([], null, concerto, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(concerto);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
