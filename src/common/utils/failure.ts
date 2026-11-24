import type { ErrorResponse, Response } from '../../interfaces';

export function failure<T>(error: ErrorResponse): Response<T> {
  return { data: null, error, headers: null };
}
