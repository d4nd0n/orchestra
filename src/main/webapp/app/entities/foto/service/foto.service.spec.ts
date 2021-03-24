import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IFoto, Foto } from '../foto.model';

import { FotoService } from './foto.service';

describe('Service Tests', () => {
  describe('Foto Service', () => {
    let service: FotoService;
    let httpMock: HttpTestingController;
    let elemDefault: IFoto;
    let expectedResult: IFoto | IFoto[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(FotoService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 0,
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

      it('should create a Foto', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new Foto()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Foto', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a Foto', () => {
        const patchObject = Object.assign({}, new Foto());

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Foto', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
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

      it('should delete a Foto', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addFotoToCollectionIfMissing', () => {
        it('should add a Foto to an empty array', () => {
          const foto: IFoto = { id: 123 };
          expectedResult = service.addFotoToCollectionIfMissing([], foto);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(foto);
        });

        it('should not add a Foto to an array that contains it', () => {
          const foto: IFoto = { id: 123 };
          const fotoCollection: IFoto[] = [
            {
              ...foto,
            },
            { id: 456 },
          ];
          expectedResult = service.addFotoToCollectionIfMissing(fotoCollection, foto);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Foto to an array that doesn't contain it", () => {
          const foto: IFoto = { id: 123 };
          const fotoCollection: IFoto[] = [{ id: 456 }];
          expectedResult = service.addFotoToCollectionIfMissing(fotoCollection, foto);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(foto);
        });

        it('should add only unique Foto to an array', () => {
          const fotoArray: IFoto[] = [{ id: 123 }, { id: 456 }, { id: 25635 }];
          const fotoCollection: IFoto[] = [{ id: 123 }];
          expectedResult = service.addFotoToCollectionIfMissing(fotoCollection, ...fotoArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const foto: IFoto = { id: 123 };
          const foto2: IFoto = { id: 456 };
          expectedResult = service.addFotoToCollectionIfMissing([], foto, foto2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(foto);
          expect(expectedResult).toContain(foto2);
        });

        it('should accept null and undefined values', () => {
          const foto: IFoto = { id: 123 };
          expectedResult = service.addFotoToCollectionIfMissing([], null, foto, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(foto);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
