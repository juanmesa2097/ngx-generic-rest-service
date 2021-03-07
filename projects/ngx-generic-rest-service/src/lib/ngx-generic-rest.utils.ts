import { map } from 'rxjs/operators';
import { HttpOptions } from './ngx-generic-rest.types';

export const resolveUrl = (
  baseUrl: string,
  config?: HttpOptions,
  ...args: string[]
): string => {
  const { url, urlPostfix } = config || {};
  let result = baseUrl;

  if (url) {
    return url;
  }

  if (args && args.length > 0) {
    result += `/${args.join('/')}`;
  }

  if (urlPostfix) {
    result += `/${urlPostfix}`;
  }

  return result;
};

export const extractRequestOptions = (options?: any) => {
  if (!options) return {};

  return [
    'headers',
    'params',
    'observe',
    'reportProgress',
    'responseType',
    'withCredentials',
  ].reduce((requestOptions: any, key) => {
    const value = options[key];

    if (value !== undefined) {
      requestOptions[key] = value;
    }

    return requestOptions;
  }, {});
};

export const mapResponse = <T>(options?: HttpOptions) =>
  map((res: T) => (options?.mapResponseFn ? options.mapResponseFn(res) : res));
