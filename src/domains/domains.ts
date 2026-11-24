import type {
  IdempotentRequestOptions,
  RequestOptions,
} from '../common/interfaces';
import { buildPath } from '../common/utils/build-path';
import { withPagination } from '../common/utils/with-query';
import type { Postbound } from '../postbound';
import type {
  CreateDomainOptions,
  CreateDomainResponse,
  CreateDomainResponseSuccess,
  GetDomainResponse,
  GetDomainResponseSuccess,
  ListDomainsOptions,
  ListDomainsResponse,
  ListDomainsResponseSuccess,
  RemoveDomainResponse,
  RemoveDomainResponseSuccess,
  UpdateDomainOptions,
  UpdateDomainResponse,
  UpdateDomainResponseSuccess,
  VerifyDomainResponse,
  VerifyDomainResponseSuccess,
} from './interfaces';

export class Domains {
  constructor(private readonly postbound: Postbound) {}

  create(
    payload: CreateDomainOptions,
    requestOptions: IdempotentRequestOptions = {},
  ): Promise<CreateDomainResponse> {
    return this.postbound.post<CreateDomainResponseSuccess>(
      buildPath('domains'),
      {
        name: payload.name,
        region: payload.region,
        custom_return_path: payload.customReturnPath,
      },
      requestOptions,
    );
  }

  get(
    id: string,
    requestOptions: RequestOptions = {},
  ): Promise<GetDomainResponse> {
    return this.postbound.get<GetDomainResponseSuccess>(
      buildPath('domains', id),
      requestOptions,
    );
  }

  list(
    options: ListDomainsOptions = {},
    requestOptions: RequestOptions = {},
  ): Promise<ListDomainsResponse> {
    return this.postbound.get<ListDomainsResponseSuccess>(
      withPagination(buildPath('domains'), options),
      requestOptions,
    );
  }

  update(
    payload: UpdateDomainOptions,
    requestOptions: RequestOptions = {},
  ): Promise<UpdateDomainResponse> {
    return this.postbound.patch<UpdateDomainResponseSuccess>(
      buildPath('domains', payload.id),
      {
        open_tracking: payload.openTracking,
        click_tracking: payload.clickTracking,
        tls: payload.tls,
        capabilities: payload.capabilities,
      },
      requestOptions,
    );
  }

  verify(
    id: string,
    requestOptions: IdempotentRequestOptions = {},
  ): Promise<VerifyDomainResponse> {
    return this.postbound.post<VerifyDomainResponseSuccess>(
      buildPath('domains', id, 'verify'),
      undefined,
      requestOptions,
    );
  }

  remove(
    id: string,
    requestOptions: RequestOptions = {},
  ): Promise<RemoveDomainResponse> {
    return this.postbound.delete<RemoveDomainResponseSuccess>(
      buildPath('domains', id),
      requestOptions,
    );
  }
}
