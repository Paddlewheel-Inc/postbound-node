import type { List, PaginationOptions } from '../common/interfaces';
import type { Response } from '../interfaces';

export type ApiKeyPermission = 'full_access' | 'sending_access';

export interface CreateApiKeyOptions {
  name: string;
  permission?: ApiKeyPermission;
  domainId?: string;
}

export interface CreateApiKeyResponseSuccess {
  id: string;
  token: string;
}

export type CreateApiKeyResponse = Response<CreateApiKeyResponseSuccess>;

export type ListApiKeysOptions = PaginationOptions;

export interface ApiKey {
  id: string;
  name: string;
  permission: ApiKeyPermission;
  domain_id: string | null;
  token_prefix: string;
  last_used_at: string | null;
  created_at: string;
}

export type ListApiKeysResponseSuccess = List<ApiKey>;

export type ListApiKeysResponse = Response<ListApiKeysResponseSuccess>;

export type RemoveApiKeyResponseSuccess = Record<string, never>;

export type RemoveApiKeyResponse = Response<RemoveApiKeyResponseSuccess>;
