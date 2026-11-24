import { version } from '../package.json';
import { ApiKeys } from './api-keys/api-keys';
import { Audiences } from './audiences/audiences';
import { Batch } from './batch/batch';
import type {
  IdempotentRequestOptions,
  RequestOptions,
} from './common/interfaces';
import { failure } from './common/utils/failure';
import { hasDotSegment } from './common/utils/has-dot-segment';
import { parseJson, toErrorResponse } from './common/utils/parse-body';
import { readEnv } from './common/utils/read-env';
import { Contacts } from './contacts/contacts';
import { Domains } from './domains/domains';
import { Emails } from './emails/emails';
import type { ErrorResponse, Response } from './interfaces';
import { Webhooks } from './webhooks/webhooks';

const defaultBaseUrl = 'https://api.postbound.app';
const defaultUserAgent = `postbound-node:${version}`;

type Method = 'GET' | 'POST' | 'PATCH' | 'DELETE';

export interface PostboundOptions {
  baseUrl?: string;
  userAgent?: string;
}

export class Postbound {
  readonly key: string;
  readonly baseUrl: string;
  readonly userAgent: string;
  private readonly debug: boolean;
  private readonly headers: Headers;

  readonly apiKeys = new ApiKeys(this);
  readonly audiences = new Audiences(this);
  readonly batch = new Batch(this);
  readonly contacts = new Contacts(this);
  readonly domains = new Domains(this);
  readonly emails = new Emails(this);
  readonly webhooks = new Webhooks(this);

  constructor(key?: string, options: PostboundOptions = {}) {
    const resolvedKey = key || readEnv('POSTBOUND_API_KEY');

    if (!resolvedKey) {
      throw new Error(
        'Missing API key. Pass it to the constructor `new Postbound("pb_123")`',
      );
    }

    this.key = resolvedKey;
    this.baseUrl =
      options.baseUrl ?? readEnv('POSTBOUND_BASE_URL') ?? defaultBaseUrl;
    this.userAgent =
      options.userAgent ?? readEnv('POSTBOUND_USER_AGENT') ?? defaultUserAgent;
    this.debug = readEnv('POSTBOUND_DEBUG') === 'true';

    this.headers = new Headers({
      Authorization: `Bearer ${this.key}`,
      'User-Agent': this.userAgent,
      'Content-Type': 'application/json',
    });
  }

  get<T>(path: string, options: RequestOptions = {}) {
    return this.send<T>('GET', path, undefined, options);
  }

  post<T>(
    path: string,
    body?: unknown,
    options: IdempotentRequestOptions = {},
  ) {
    return this.send<T>('POST', path, body, options);
  }

  patch<T>(path: string, body: unknown, options: RequestOptions = {}) {
    return this.send<T>('PATCH', path, body, options);
  }

  delete<T>(path: string, options: RequestOptions = {}) {
    return this.send<T>('DELETE', path, undefined, options);
  }

  private send<T>(
    method: Method,
    path: string,
    body: unknown,
    options: IdempotentRequestOptions,
  ): Promise<Response<T>> {
    const headers = new Headers(this.headers);

    new Headers(options.headers).forEach((value, name) => {
      headers.set(name, value);
    });

    if (options.idempotencyKey) {
      headers.set('Idempotency-Key', options.idempotencyKey);
    }

    return this.execute<T>(path, {
      method,
      headers,
      signal: options.signal,
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  }

  private async execute<T>(
    path: string,
    init: RequestInit,
  ): Promise<Response<T>> {
    if (hasDotSegment(path)) {
      return this.fail<T>(
        {
          name: 'invalid_parameter',
          statusCode: null,
          message: 'Path parameters cannot be `.` or `..`.',
        },
        path,
      );
    }

    try {
      const response = await fetch(`${this.baseUrl}${path}`, init);
      const headers = Object.fromEntries(response.headers.entries());
      const parsed = parseJson(await response.text());

      if (!response.ok || parsed === undefined) {
        return this.fail<T>(
          toErrorResponse(parsed, response.status),
          path,
          headers,
          response.status,
        );
      }

      return { data: parsed as T, error: null, headers };
    } catch (error) {
      if (init.signal?.aborted) {
        throw error;
      }

      return this.fail<T>(
        {
          name: 'application_error',
          statusCode: null,
          message: 'Unable to fetch data. The request could not be resolved.',
        },
        path,
      );
    }
  }

  private fail<T>(
    error: ErrorResponse,
    path: string,
    headers: Record<string, string> | null = null,
    status?: number,
  ): Response<T> {
    if (this.debug) {
      console.error('[Postbound API Error]:', {
        ...(status !== undefined && { status }),
        error,
        path,
      });
    }

    return { ...failure<T>(error), headers };
  }
}
