import { map } from 'rxjs/operators';
import { HttpOptions } from './ngx-generic-rest.types';

/**
 * Dynamically resolves API URL
 * @param baseUrl base end path of the API URL (eg., https://example.com/api)
 * @param options HTTP base config options
 * @param args extra arguments that are concatenated to URL before postfix.
 * @returns API endpoint
 */
export const resolveUrl = (
  baseUrl: string,
  options?: HttpOptions,
  ...args: string[]
): string => {
  const { urlRewrite, urlPostfix } = options || {};

  if (urlRewrite) {
    return urlRewrite;
  }

  let result = baseUrl;

  if (args && args.length > 0) {
    result += `/${args.join('/')}`;
  }

  if (urlPostfix) {
    result += `/${urlPostfix}`;
  }

  return result;
};

/**
 * Extracts actual requests options from any object
 * @param options any object that may contain a request parameter
 * @returns object with 0 or n request parameters
 */
export const extractRequestOptions = (options?: any) => {
  if (!options || typeof options !== 'object') {
    return {};
  }

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

/**
 * Maps API response to a desired result
 * @param options HTTP base config options
 * @returns any result that is specified
 */
export const mapResponse = <T>(options?: HttpOptions) =>
  map((res: T) => (options?.mapFn ? options.mapFn(res) : res));
