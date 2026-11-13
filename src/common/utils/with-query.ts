import type { PaginationOptions } from '../interfaces';

type QueryValue = string | number | undefined;

export function withQuery(
  path: string,
  params: Record<string, QueryValue>,
): string {
  const search = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== '') {
      search.set(key, String(value));
    }
  }

  const query = search.toString();
  return query ? `${path}?${query}` : path;
}

export function withPagination(
  path: string,
  options: PaginationOptions,
  extra: Record<string, QueryValue> = {},
): string {
  return withQuery(path, {
    limit: options.limit,
    after: options.after,
    before: options.before,
    ...extra,
  });
}
