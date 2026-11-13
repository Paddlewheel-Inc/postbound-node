export interface RequestOptions {
  headers?: HeadersInit;
  signal?: AbortSignal;
}

export interface IdempotentRequestOptions extends RequestOptions {
  idempotencyKey?: string;
}

export type PaginationOptions = {
  limit?: number;
} & (
  | {
      after?: string;
      before?: never;
    }
  | {
      before?: string;
      after?: never;
    }
);

export interface List<T> {
  object: 'list';
  has_more: boolean;
  data: T[];
}

export interface DeletedResource<Object extends string> {
  object: Object;
  id: string;
  deleted: true;
}

export interface ResourceReference<Object extends string> {
  object: Object;
  id: string;
}

export type RequireAtLeastOne<T> = {
  [K in keyof T]-?: Required<Pick<T, K>> &
    Partial<Pick<T, Exclude<keyof T, K>>>;
}[keyof T];
