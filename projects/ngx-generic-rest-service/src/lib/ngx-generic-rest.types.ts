import { HttpHeaders, HttpParams } from '@angular/common/http';

export interface HttpConfig {
  baseUrl: string;
  resourceName: string;
}

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type ResultMessage = {
  successMsg?: string;
  errorMsg?: string;
};

type _httpHeaders = HttpHeaders | { [header: string]: string | string[] };
type _httpParams = HttpParams | { [param: string]: string | string[] };
type _observe = 'body' | 'events' | 'response';
type _responseType = 'arraybuffer' | 'blob' | 'json' | 'text';

export type HttpRequestOptions = {
  headers?: _httpHeaders;
  params?: _httpParams;
  observe?: _observe;
  reportProgress?: boolean;
  responseType?: _responseType;
  withCredentials?: boolean;
};

export type HttpOptions<T = any> = HttpRequestOptions & {
  url?: string;
  urlPostfix?: string;
  mapResponseFn?: (res: any) => T;
};

export type HttpGetOptions<T = any> = HttpOptions<T> & ResultMessage;
export type HttpAddOptions<T = any> = HttpOptions<T> & ResultMessage;
export type HttpUpdateOptions<T = any> = HttpOptions<T> & {
  method?: 'PUT' | 'PATCH';
} & ResultMessage;
export type HttpDeleteOptions<T = any> = HttpOptions<T> & ResultMessage;
