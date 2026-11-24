import type {
  IdempotentRequestOptions,
  RequestOptions,
} from '../common/interfaces';
import { buildPath } from '../common/utils/build-path';
import { withPagination } from '../common/utils/with-query';
import type { Postbound } from '../postbound';
import type {
  CreateAudienceOptions,
  CreateAudienceResponse,
  CreateAudienceResponseSuccess,
  GetAudienceResponse,
  GetAudienceResponseSuccess,
  ListAudiencesOptions,
  ListAudiencesResponse,
  ListAudiencesResponseSuccess,
  RemoveAudiencesResponse,
  RemoveAudiencesResponseSuccess,
} from './interfaces';

export class Audiences {
  constructor(private readonly postbound: Postbound) {}

  create(
    payload: CreateAudienceOptions,
    requestOptions: IdempotentRequestOptions = {},
  ): Promise<CreateAudienceResponse> {
    return this.postbound.post<CreateAudienceResponseSuccess>(
      buildPath('audiences'),
      payload,
      requestOptions,
    );
  }

  get(
    id: string,
    requestOptions: RequestOptions = {},
  ): Promise<GetAudienceResponse> {
    return this.postbound.get<GetAudienceResponseSuccess>(
      buildPath('audiences', id),
      requestOptions,
    );
  }

  list(
    options: ListAudiencesOptions = {},
    requestOptions: RequestOptions = {},
  ): Promise<ListAudiencesResponse> {
    return this.postbound.get<ListAudiencesResponseSuccess>(
      withPagination(buildPath('audiences'), options),
      requestOptions,
    );
  }

  remove(
    id: string,
    requestOptions: RequestOptions = {},
  ): Promise<RemoveAudiencesResponse> {
    return this.postbound.delete<RemoveAudiencesResponseSuccess>(
      buildPath('audiences', id),
      requestOptions,
    );
  }
}
