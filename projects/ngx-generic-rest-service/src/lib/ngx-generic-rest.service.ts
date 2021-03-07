import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {
  HttpAddOptions,
  HttpConfig,
  HttpDeleteOptions,
  HttpGetOptions,
  HttpMethod,
  HttpUpdateOptions,
} from './ngx-generic-rest.types';
import {
  extractRequestOptions,
  mapResponse,
  resolveUrl,
} from './ngx-generic-rest.utils';

export class NgxGenericRestService {
  private readonly _http: HttpClient;

  constructor(protected _httpConfig: HttpConfig) {
    this._http = inject(HttpClient);
  }

  get url(): string {
    const { baseUrl, resourceName } = this._httpConfig;
    return `${baseUrl}/${resourceName}`;
  }

  getHttpClient(): HttpClient {
    return this._http;
  }

  get<T>(options?: HttpGetOptions): Observable<T> {
    const method: HttpMethod = 'GET';
    const url = resolveUrl(this.url, options);
    const requestOptions = extractRequestOptions(options);

    return this._http
      .request<T>(method, url, requestOptions)
      .pipe(mapResponse(options), catchError(this.handleError));
  }

  add<T>(body: T, options?: HttpAddOptions): Observable<T> {
    const method: HttpMethod = 'POST';
    const url = resolveUrl(this.url, options);
    const optionsWithBody = { ...extractRequestOptions(options), body };

    return this._http
      .request<T>(method, url, optionsWithBody)
      .pipe(mapResponse(options), catchError(this.handleError));
  }

  update<T>(
    id: string | number,
    body: T,
    options?: HttpUpdateOptions
  ): Observable<T> {
    const method: HttpMethod = options?.method || 'PUT';
    const url = resolveUrl(this.url, options, id.toString());
    const optionsWithBody = { ...extractRequestOptions(options), body };

    return this._http
      .request<T>(method, url, optionsWithBody)
      .pipe(mapResponse(options), catchError(this.handleError));
  }

  delete<T>(id: string | number, options?: HttpDeleteOptions): Observable<T> {
    const method: HttpMethod = 'DELETE';
    const url = resolveUrl(this.url, options, id.toString());
    const requestOptions = extractRequestOptions(options);

    return this._http
      .request<T>(method, url, requestOptions)
      .pipe(mapResponse(options), catchError(this.handleError));
  }

  protected handleError(error: any): Observable<never> {
    return throwError(error.message || error);
  }
}
