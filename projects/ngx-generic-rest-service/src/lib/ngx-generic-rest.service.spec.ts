import { HttpHeaders, HttpParams } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';
import { extractRequestOptions } from './ngx-generic-rest.utils';
import { TestEntity, TestService } from './test-setup';

describe('NgxGenericRestService', () => {
  describe('config', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [TestService],
        imports: [HttpClientTestingModule],
      });
    });

    it('should be created', inject(
      [TestService],
      (testService: TestService) => {
        expect(testService).toBeTruthy();
      }
    ));

    it('should return "inline-base-url/inline-resource-name" when url accesor is called', inject(
      [TestService],
      (testService: TestService) => {
        const apiUrl = testService.url;
        const expectedUrl = 'inline-base-url/inline-resource-name';
        expect(apiUrl).toBe(expectedUrl);
      }
    ));
  });

  describe('utils', () => {
    it('should extract HttpRequestOptions from any object', () => {
      const mockObject = {
        successMsg: 'Operation successful',
        errorMsg: 'Operation failed',
        urlPostfix: 'bar/foo',
        headers: { 'x-foo': 'foo', 'x-bar': 'bar' },
        params: { foo: 'foo', bar: 'bar' },
        observe: 'body',
        reportProgress: false,
        responseType: 'json',
        withCredentials: false,
      };

      const expectedRequestOptions = {
        headers: { 'x-foo': 'foo', 'x-bar': 'bar' },
        params: { foo: 'foo', bar: 'bar' },
        observe: 'body',
        reportProgress: false,
        responseType: 'json',
        withCredentials: false,
      };

      const requestOptions = extractRequestOptions(mockObject);
      expect(requestOptions).toEqual(expectedRequestOptions);
    });

    it("should return empty object if there's no common properties between HttpRequestOptions & object", () => {
      const mockObject = {
        foo: 'foo',
        bar: 'bar',
      };

      const expectedRequestOptions = {};

      const requestOptions = extractRequestOptions(mockObject);
      expect(requestOptions).toEqual(expectedRequestOptions);
    });
  });

  describe('get', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [TestService],
        imports: [HttpClientTestingModule],
      });
    });

    it('should return result from request', inject(
      [TestService, HttpTestingController],
      (testService: TestService, httpMock: HttpTestingController) => {
        const dummyData: TestEntity[] = [
          { id: 1, foo: 'foo', bar: 1 },
          { id: 2, foo: 'bar', bar: 2 },
        ];

        testService.get<TestEntity[]>().subscribe((result) => {
          expect(result).toEqual(dummyData);
        });

        const request = httpMock.expectOne(testService.url);
        request.flush(dummyData);
      }
    ));

    it('should override request URL when called with config.url', inject(
      [TestService, HttpTestingController],
      (testService: TestService, httpMock: HttpTestingController) => {
        const dummyUrl = 'dummy-url';
        testService.get({ url: dummyUrl }).subscribe();
        const request = httpMock.expectOne(dummyUrl);
        request.flush([]);
      }
    ));

    it('should add postfix to request URL when called with config.urlPostfix', inject(
      [TestService, HttpTestingController],
      (testService: TestService, httpMock: HttpTestingController) => {
        const dummyPostfix = 'foo/0/bar/1';
        const expectedUrl = `${testService.url}/${dummyPostfix}`;
        testService.get({ urlPostfix: dummyPostfix }).subscribe();
        const request = httpMock.expectOne((req) => req.url === expectedUrl);
        request.flush([]);
      }
    ));

    it("should map request's response to desired result when called with config.mapResponseFn", inject(
      [TestService, HttpTestingController],
      (testService: TestService, httpMock: HttpTestingController) => {
        const dummyResponse: { data: TestEntity[]; count: number } = {
          data: [
            { id: 1, foo: 'foo', bar: 1 },
            { id: 2, foo: 'bar', bar: 2 },
          ],
          count: 2,
        };

        testService
          .get<TestEntity[]>({
            mapResponseFn: (res) => res.data,
          })
          .subscribe((result) => {
            expect(result).toEqual(dummyResponse.data);
          });

        const request = httpMock.expectOne(testService.url);
        request.flush(dummyResponse);
      }
    ));

    it("should transform request's result to desired result when called with config.mapResponseFn", inject(
      [TestService, HttpTestingController],
      (testService: TestService, httpMock: HttpTestingController) => {
        const dummyData: TestEntity[] = [
          { id: 1, foo: 'foo', bar: 1 },
          { id: 2, foo: 'bar', bar: 2 },
        ];

        const expectedResult = [
          { name: 'foo', age: 18 },
          { name: 'bar', age: 18 },
        ];

        testService
          .get<{ name: string; age: number }[]>({
            mapResponseFn: (res: TestEntity[]) =>
              res.map((entity) => ({ name: entity.foo, age: 18 })),
          })
          .subscribe((result) => {
            expect(result).toEqual(expectedResult);
          });

        const request = httpMock.expectOne(testService.url);
        request.flush(dummyData);
      }
    ));

    it('should add headers to request when called with config.headers', inject(
      [TestService, HttpTestingController],
      (testService: TestService, httpMock: HttpTestingController) => {
        const headers = new HttpHeaders()
          .set('x-foo', 'foo')
          .set('x-bar', 'bar');
        testService.get({ headers }).subscribe();

        const request = httpMock.expectOne(testService.url);
        expect(request.request.headers.get('x-foo')).toBe('foo');
        expect(request.request.headers.get('x-bar')).toBe('bar');
        request.flush([]);
      }
    ));

    it('should add params to request when called with config.params', inject(
      [TestService, HttpTestingController],
      (testService: TestService, httpMock: HttpTestingController) => {
        const params = new HttpParams().set('foo', 'foo').set('bar', 'bar');
        testService.get({ params }).subscribe();
        const request = httpMock.expectOne(
          (req) => req.url === testService.url
        );
        expect(request.request.params.get('foo')).toEqual('foo');
        expect(request.request.params.get('bar')).toEqual('bar');
        request.flush([]);
      }
    ));
  });

  describe('add', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [TestService],
        imports: [HttpClientTestingModule],
      });
    });

    it('should return result from request', inject(
      [TestService, HttpTestingController],
      (testService: TestService, httpMock: HttpTestingController) => {
        const dummyEntity: TestEntity = { foo: 'foo', bar: 999 };
        testService.add<TestEntity>(dummyEntity).subscribe((result) => {
          expect(result).toEqual(dummyEntity);
        });
        const request = httpMock.expectOne(testService.url);
        request.flush(dummyEntity);
      }
    ));

    it('should override request URL when called with config.url', inject(
      [TestService, HttpTestingController],
      (testService: TestService, httpMock: HttpTestingController) => {
        const dummyEntity: TestEntity = { foo: 'foo', bar: 999 };
        const dummyUrl = 'dummy-url';
        testService
          .add<TestEntity>(dummyEntity, { url: dummyUrl })
          .subscribe();
        const request = httpMock.expectOne(dummyUrl);
        request.flush([]);
      }
    ));

    it('should add postfix to request URL when called with config.urlPostfix', inject(
      [TestService, HttpTestingController],
      (testService: TestService, httpMock: HttpTestingController) => {
        const dummyEntity: TestEntity = { foo: 'foo', bar: 999 };
        const dummyPostfix = 'foo/0/bar/1';
        const expectedUrl = `${testService.url}/${dummyPostfix}`;
        testService
          .add<TestEntity>(dummyEntity, { urlPostfix: dummyPostfix })
          .subscribe();
        const request = httpMock.expectOne((req) => req.url === expectedUrl);
        request.flush([]);
      }
    ));

    it("should map request's response to desired result when called with config.mapResponseFn", inject(
      [TestService, HttpTestingController],
      (testService: TestService, httpMock: HttpTestingController) => {
        const dummyEntity: TestEntity = { foo: 'foo', bar: 999 };

        const dummyResponse: {
          succeeded: boolean;
          message: string;
          result: TestEntity;
        } = {
          succeeded: true,
          message: 'OK',
          result: { id: 1, foo: 'foo', bar: 999 },
        };

        testService
          .add<TestEntity>(dummyEntity, {
            mapResponseFn: (res) => res.result,
          })
          .subscribe((result) => {
            expect(result).toEqual(dummyResponse.result);
          });

        const request = httpMock.expectOne(testService.url);
        request.flush(dummyResponse);
      }
    ));

    it('should add headers to request when called with config.headers', inject(
      [TestService, HttpTestingController],
      (testService: TestService, httpMock: HttpTestingController) => {
        const dummyEntity: TestEntity = { foo: 'foo', bar: 999 };
        const headers = new HttpHeaders()
          .set('x-foo', 'foo')
          .set('x-bar', 'bar');
        testService
          .add<TestEntity>(dummyEntity, { headers })
          .subscribe();

        const request = httpMock.expectOne(testService.url);
        expect(request.request.headers.get('x-foo')).toBe('foo');
        expect(request.request.headers.get('x-bar')).toBe('bar');
        request.flush([]);
      }
    ));

    it('should add params to request when called with config.params', inject(
      [TestService, HttpTestingController],
      (testService: TestService, httpMock: HttpTestingController) => {
        const dummyEntity: TestEntity = { foo: 'foo', bar: 999 };
        const params = new HttpParams().set('foo', 'foo').set('bar', 'bar');
        testService
          .add<TestEntity>(dummyEntity, { params })
          .subscribe();

        const request = httpMock.expectOne(
          (req) => req.url === testService.url
        );
        expect(request.request.params.get('foo')).toEqual('foo');
        expect(request.request.params.get('bar')).toEqual('bar');
        request.flush([]);
      }
    ));
  });

  describe('update', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [TestService],
        imports: [HttpClientTestingModule],
      });
    });

    it('should return result from request', inject(
      [TestService, HttpTestingController],
      (testService: TestService, httpMock: HttpTestingController) => {
        const dummyId = 1;
        const dummyEntity: TestEntity = { foo: 'foo', bar: 999 };
        const expectedResult = { id: dummyId, ...dummyEntity };

        testService
          .update<TestEntity>(dummyId, dummyEntity)
          .subscribe((result) => {
            expect(result).toEqual(expectedResult);
          });

        const request = httpMock.expectOne(`${testService.url}/${dummyId}`);
        request.flush(expectedResult);
      }
    ));

    it('should override request URL when called with config.url', inject(
      [TestService, HttpTestingController],
      (testService: TestService, httpMock: HttpTestingController) => {
        const dummyId = 1;
        const dummyEntity: TestEntity = { foo: 'foo', bar: 999 };
        const dummyUrl = 'dummy-url';

        testService
          .update<TestEntity>(dummyId, dummyEntity, { url: dummyUrl })
          .subscribe();

        const request = httpMock.expectOne(dummyUrl);
        request.flush([]);
      }
    ));

    it('should add postfix to request URL when called with config.urlPostfix', inject(
      [TestService, HttpTestingController],
      (testService: TestService, httpMock: HttpTestingController) => {
        const dummyId = 1;
        const dummyEntity: TestEntity = { foo: 'foo', bar: 999 };
        const dummyPostfix = 'foo/0/bar/1';
        const expectedUrl = `${testService.url}/${dummyId}/${dummyPostfix}`;

        testService
          .update<TestEntity>(dummyId, dummyEntity, {
            urlPostfix: dummyPostfix,
          })
          .subscribe();

        const request = httpMock.expectOne((req) => req.url === expectedUrl);
        request.flush([]);
      }
    ));

    it("should map request's response to desired result when called with config.mapResponseFn", inject(
      [TestService, HttpTestingController],
      (testService: TestService, httpMock: HttpTestingController) => {
        const dummyId = 1;
        const dummyEntity: TestEntity = { foo: 'foo', bar: 999 };

        const dummyResponse: {
          succeeded: boolean;
          message: string;
          result: TestEntity;
        } = {
          succeeded: true,
          message: 'OK',
          result: { id: 1, foo: 'foo', bar: 999 },
        };

        testService
          .update<TestEntity>(dummyId, dummyEntity, {
            mapResponseFn: (res) => res.result,
          })
          .subscribe((result) => {
            expect(result).toEqual(dummyResponse.result);
          });

        const request = httpMock.expectOne(`${testService.url}/${dummyId}`);
        request.flush(dummyResponse);
      }
    ));

    it('should add headers to request when called with config.headers', inject(
      [TestService, HttpTestingController],
      (testService: TestService, httpMock: HttpTestingController) => {
        const dummyId = 1;
        const dummyEntity: TestEntity = { foo: 'foo', bar: 999 };
        const headers = new HttpHeaders()
          .set('x-foo', 'foo')
          .set('x-bar', 'bar');
        testService
          .update<TestEntity>(dummyId, dummyEntity, { headers })
          .subscribe();

        const request = httpMock.expectOne(`${testService.url}/${dummyId}`);
        expect(request.request.headers.get('x-foo')).toBe('foo');
        expect(request.request.headers.get('x-bar')).toBe('bar');
        request.flush([]);
      }
    ));

    it('should add params to request when called with config.params', inject(
      [TestService, HttpTestingController],
      (testService: TestService, httpMock: HttpTestingController) => {
        const dummyId = 1;
        const dummyEntity: TestEntity = { foo: 'foo', bar: 999 };
        const params = new HttpParams().set('foo', 'foo').set('bar', 'bar');
        testService
          .update<TestEntity>(dummyId, dummyEntity, { params })
          .subscribe();

        const request = httpMock.expectOne(
          (req) => req.url === `${testService.url}/${dummyId}`
        );
        expect(request.request.params.get('foo')).toEqual('foo');
        expect(request.request.params.get('bar')).toEqual('bar');
        request.flush([]);
      }
    ));
  });

  describe('delete', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [TestService],
        imports: [HttpClientTestingModule],
      });
    });

    it('should return result from request', inject(
      [TestService, HttpTestingController],
      (testService: TestService, httpMock: HttpTestingController) => {
        const dummyId = 1;
        const dummyEntity: TestEntity = { id: 1, foo: 'foo', bar: 999 };

        testService.delete<TestEntity>(dummyId).subscribe((result) => {
          expect(result).toEqual(dummyEntity);
        });

        const request = httpMock.expectOne(`${testService.url}/${dummyId}`);
        request.flush(dummyEntity);
      }
    ));

    it('should override request URL when called with config.url', inject(
      [TestService, HttpTestingController],
      (testService: TestService, httpMock: HttpTestingController) => {
        const dummyId = 1;
        const dummyUrl = 'dummy-url';

        testService
          .delete<TestEntity>(dummyId, { url: dummyUrl })
          .subscribe();

        const request = httpMock.expectOne(dummyUrl);
        request.flush([]);
      }
    ));

    it('should add postfix to request URL when called with config.urlPostfix', inject(
      [TestService, HttpTestingController],
      (testService: TestService, httpMock: HttpTestingController) => {
        const dummyId = 1;
        const dummyPostfix = 'foo/0/bar/1';
        const expectedUrl = `${testService.url}/${dummyId}/${dummyPostfix}`;

        testService
          .delete<TestEntity>(dummyId, {
            urlPostfix: dummyPostfix,
          })
          .subscribe();

        const request = httpMock.expectOne((req) => req.url === expectedUrl);
        request.flush([]);
      }
    ));

    it("should map request's response to desired result when called with config.mapResponseFn", inject(
      [TestService, HttpTestingController],
      (testService: TestService, httpMock: HttpTestingController) => {
        const dummyId = 1;

        const dummyResponse: {
          succeeded: boolean;
          message: string;
          result: TestEntity;
        } = {
          succeeded: true,
          message: 'OK',
          result: { id: 1, foo: 'foo', bar: 999 },
        };

        testService
          .delete<string>(dummyId, {
            mapResponseFn: (res) =>
              res.succeeded && res.result ? 'DELETED' : 'NOT_DELETED',
          })
          .subscribe((result) => {
            expect(result).toEqual('DELETED');
          });

        const request = httpMock.expectOne(`${testService.url}/${dummyId}`);
        request.flush(dummyResponse);
      }
    ));

    it('should add headers to request when called with config.headers', inject(
      [TestService, HttpTestingController],
      (testService: TestService, httpMock: HttpTestingController) => {
        const dummyId = 1;
        const headers = new HttpHeaders()
          .set('x-foo', 'foo')
          .set('x-bar', 'bar');
        testService
          .delete<TestEntity>(dummyId, { headers })
          .subscribe();

        const request = httpMock.expectOne(`${testService.url}/${dummyId}`);
        expect(request.request.headers.get('x-foo')).toBe('foo');
        expect(request.request.headers.get('x-bar')).toBe('bar');
        request.flush([]);
      }
    ));

    it('should add params to request when called with config.params', inject(
      [TestService, HttpTestingController],
      (testService: TestService, httpMock: HttpTestingController) => {
        const dummyId = 1;
        const params = new HttpParams().set('foo', 'foo').set('bar', 'bar');
        testService
          .delete<TestEntity>(dummyId, { params })
          .subscribe();

        const request = httpMock.expectOne(
          (req) => req.url === `${testService.url}/${dummyId}`
        );
        expect(request.request.params.get('foo')).toEqual('foo');
        expect(request.request.params.get('bar')).toEqual('bar');
        request.flush([]);
      }
    ));
  });
});
