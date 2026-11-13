import type {
  IdempotentRequestOptions,
  RequestOptions,
} from '../common/interfaces';
import { buildPath } from '../common/utils/build-path';
import { withPagination } from '../common/utils/with-query';
import type { Postbound } from '../postbound';
import type {
  CreateApiKeyOptions,
  CreateApiKeyResponse,
  CreateApiKeyResponseSuccess,
  ListApiKeysOptions,
  ListApiKeysResponse,
  ListApiKeysResponseSuccess,
  RemoveApiKeyResponse,
  RemoveApiKeyResponseSuccess,
} from './interfaces';

export class ApiKeys {
  constructor(private readonly postbound: Postbound) {}

  create(
    payload: CreateApiKeyOptions,
    requestOptions: IdempotentRequestOptions = {},
  ): Promise<CreateApiKeyResponse> {
    return this.postbound.post<CreateApiKeyResponseSuccess>(
      buildPath('api-keys'),
      {
        name: payload.name,
        permission: payload.permission,
        domain_id: payload.domainId,
      },
      requestOptions,
    );
  }

  list(
    options: ListApiKeysOptions = {},
    requestOptions: RequestOptions = {},
  ): Promise<ListApiKeysResponse> {
    return this.postbound.get<ListApiKeysResponseSuccess>(
      withPagination(buildPath('api-keys'), options),
      requestOptions,
    );
  }

  remove(
    id: string,
    requestOptions: RequestOptions = {},
  ): Promise<RemoveApiKeyResponse> {
    return this.postbound.delete<RemoveApiKeyResponseSuccess>(
      buildPath('api-keys', id),
      requestOptions,
    );
  }
}
