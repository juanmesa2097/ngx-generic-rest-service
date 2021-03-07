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
          { name: 'foo', age: 2 },
          { name: 'bar', age: 4 },
        ];

        testService
          .get<{ name: string; age: number }[]>({
            mapResponseFn: (res: TestEntity[]) =>
              res.map((entity) => ({ name: entity.foo, age: entity.bar * 2 })),
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
        const req = httpMock.expectOne((req) => req.url === testService.url);
        expect(req.request.params.get('foo')).toEqual('foo');
        expect(req.request.params.get('bar')).toEqual('bar');
        req.flush([]);
      }
    ));
  });

  describe('add', () => {});

  describe('update', () => {});

  describe('delete', () => {});
});
