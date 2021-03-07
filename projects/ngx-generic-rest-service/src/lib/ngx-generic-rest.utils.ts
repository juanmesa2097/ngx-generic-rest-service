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

export const extractRequestConfig = (config?: HttpOptions) => ({});
