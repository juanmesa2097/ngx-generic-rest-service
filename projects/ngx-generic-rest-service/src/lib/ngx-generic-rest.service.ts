import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {
  HttpAddOptions,
  HttpConfig,
  HttpDeleteOptions,
  HttpGetListOptions,
  HttpGetSingleOptions,
  HttpMethod,
  HttpUpdateOptions,
} from './ngx-generic-rest.types';
import {
  extractRequestOptions,
  mapResponse,
  resolveUrl,
} from './ngx-generic-rest.utils';

export class NgxGenericRestService {
  private readonly http: HttpClient;

  constructor(protected httpConfig: HttpConfig) {
    this.http = inject(HttpClient);
  }

  get url(): string {
    const { baseUrl, resourceName } = this.httpConfig;
    return `${baseUrl}/${resourceName}`;
  }

  /**
   * Exposes HTTP client service to allow custom HTTP requests
   * @returns HTTP client service
   */
  getHttpClient(): HttpClient {
    return this.http;
  }

  /**
   * Performs a GET HTTP request
   * @param options custom specific HTTP options for GET list requests
   * @returns generic type | list of objects
   */
  list<T>(options?: HttpGetListOptions): Observable<T> {
    const method: HttpMethod = 'GET';
    const url = resolveUrl(this.url, options);
    const requestOptions = extractRequestOptions(options);

    return this.http
      .request<T>(method, url, requestOptions)
      .pipe(mapResponse(options), catchError(this.handleError));
  }

  /**
   * Performs a GET HTTP request
   * @param options custom specific HTTP options for GET single requests
   * @returns generic type | single object
   */
  single<T>(
    id: string | number,
    options?: HttpGetSingleOptions
  ): Observable<T> {
    const method: HttpMethod = 'GET';
    const url = resolveUrl(this.url, options, id.toString());
    const requestOptions = extractRequestOptions(options);

    return this.http
      .request<T>(method, url, requestOptions)
      .pipe(mapResponse(options), catchError(this.handleError));
  }

  /**
   * Performs a POST HTTP request (flexible for bulk inserting)
   * @param options custom specific HTTP options for Add requests
   * @returns generic type | single object or list of objects
   */
  add<T>(body: T, options?: HttpAddOptions): Observable<T> {
    const method: HttpMethod = 'POST';
    const url = resolveUrl(this.url, options);
    const requestOptions = { ...extractRequestOptions(options), body };

    return this.http
      .request<T>(method, url, requestOptions)
      .pipe(mapResponse(options), catchError(this.handleError));
  }

  /**
   * Performs a PUT | PATCH HTTP request (flexible for bulk updating)
   * @param options custom specific HTTP options for Update requests
   * @returns generic type | single object or list of objects
   */
  update<T>(
    id: string | number,
    body: T,
    options?: HttpUpdateOptions
  ): Observable<T> {
    const method: HttpMethod = options?.method || 'PUT';
    const url = resolveUrl(this.url, options, id.toString());
    const requestOptions = { ...extractRequestOptions(options), body };

    return this.http
      .request<T>(method, url, requestOptions)
      .pipe(mapResponse(options), catchError(this.handleError));
  }

  /**
   * Performs a DELETE HTTP request (flexible for bulk deleting)
   * @param options custom specific HTTP options for Delete requests
   * @returns generic type | single object or list of objects
   */
  delete<T>(id: string | number, options?: HttpDeleteOptions): Observable<T> {
    const method: HttpMethod = 'DELETE';
    const url = resolveUrl(this.url, options, id.toString());
    const requestOptions = extractRequestOptions(options);

    return this.http
      .request<T>(method, url, requestOptions)
      .pipe(mapResponse(options), catchError(this.handleError));
  }

  protected handleError(error: any): Observable<never> {
    return throwError(error.message || error);
  }
}
