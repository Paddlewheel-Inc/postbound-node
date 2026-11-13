import type { ErrorResponse } from '../../interfaces';

export function parseJson(body: string): unknown {
  if (body === '') {
    return {};
  }

  try {
    return JSON.parse(body);
  } catch {
    return undefined;
  }
}

export function toErrorResponse(
  parsed: unknown,
  statusCode: number,
): ErrorResponse {
  if (isErrorBody(parsed)) {
    return parsed;
  }

  return {
    name: 'application_error',
    statusCode,
    message:
      'Internal server error. We are unable to process your request right now, please try again later.',
  };
}

function isErrorBody(value: unknown): value is ErrorResponse {
  return (
    typeof value === 'object' &&
    value !== null &&
    'name' in value &&
    typeof value.name === 'string' &&
    'message' in value &&
    typeof value.message === 'string'
  );
}
