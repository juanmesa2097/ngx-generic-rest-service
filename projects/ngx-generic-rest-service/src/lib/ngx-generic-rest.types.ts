import { HttpHeaders, HttpParams } from '@angular/common/http';

export interface HttpConfig {
  baseUrl: string;
  resourceName: string;
}

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type HttpRequestOptions = {
  headers?: _httpHeaders;
  params?: _httpParams;
  observe?: _observe;
  reportProgress?: boolean;
  responseType?: _responseType;
  withCredentials?: boolean;
};

type _httpHeaders = HttpHeaders | { [header: string]: string | string[] };
type _httpParams = HttpParams | { [param: string]: string | string[] };
type _observe = 'body' | 'events' | 'response';
type _responseType = 'arraybuffer' | 'blob' | 'json' | 'text';

export type HttpOptions<T = any> = HttpRequestOptions & {
  urlRewrite?: string;
  urlPostfix?: string;
  mapFn?: (res: any) => T;
};

export type HttpGetListOptions<T = any> = HttpOptions<T>;
export type HttpGetSingleOptions<T = any> = HttpOptions<T>;
export type HttpAddOptions<T = any> = HttpOptions<T>;
export type HttpUpdateOptions<T = any> = HttpOptions<T> & {
  method?: 'PUT' | 'PATCH';
};
export type HttpDeleteOptions<T = any> = HttpOptions<T>;
