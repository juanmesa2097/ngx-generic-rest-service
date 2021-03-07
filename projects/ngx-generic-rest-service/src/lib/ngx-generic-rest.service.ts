import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpConfig, HttpMethod, HttpOptions } from './ngx-generic-rest.types';
import { extractRequestConfig, resolveUrl } from './ngx-generic-rest.utils';

export class NgxGenericRestService {
  private readonly _httpClient: HttpClient;

  constructor(protected _httpConfig: HttpConfig) {
    this._httpClient = inject(HttpClient);
  }

  get url(): string {
    const { baseUrl, resourceName } = this._httpConfig;
    return `${baseUrl}/${resourceName}`;
  }

  getHttpClient(): HttpClient {
    return this._httpClient;
  }

  get<T>(options?: HttpOptions): Observable<T> {
    const method: HttpMethod = 'GET';
    const url = resolveUrl(this.url, options);
    const requestConfig = extractRequestConfig(options);
    return this._httpClient.request<T>(method, url, requestConfig);
  }
}
