import type { RequestOptions } from '../common/interfaces';
import { buildPath } from '../common/utils/build-path';
import { withPagination } from '../common/utils/with-query';
import type { Postbound } from '../postbound';
import type {
  CancelEmailResponse,
  CancelEmailResponseSuccess,
  CreateEmailOptions,
  CreateEmailRequestOptions,
  CreateEmailResponse,
  CreateEmailResponseSuccess,
  GetEmailResponse,
  GetEmailResponseSuccess,
  ListEmailsOptions,
  ListEmailsResponse,
  ListEmailsResponseSuccess,
  UpdateEmailOptions,
  UpdateEmailResponse,
  UpdateEmailResponseSuccess,
} from './interfaces';
import { Receiving } from './receiving/receiving';
import { toEmailApiOptions } from './to-email-api-options';

export class Emails {
  readonly receiving: Receiving;

  constructor(private readonly postbound: Postbound) {
    this.receiving = new Receiving(postbound);
  }

  send(
    payload: CreateEmailOptions,
    requestOptions: CreateEmailRequestOptions = {},
  ): Promise<CreateEmailResponse> {
    return this.create(payload, requestOptions);
  }

  async create(
    payload: CreateEmailOptions,
    requestOptions: CreateEmailRequestOptions = {},
  ): Promise<CreateEmailResponse> {
    return this.postbound.post<CreateEmailResponseSuccess>(
      '/emails',
      await toEmailApiOptions(payload),
      requestOptions,
    );
  }

  get(
    id: string,
    requestOptions: RequestOptions = {},
  ): Promise<GetEmailResponse> {
    return this.postbound.get<GetEmailResponseSuccess>(
      buildPath('emails', id),
      requestOptions,
    );
  }

  list(
    options: ListEmailsOptions = {},
    requestOptions: RequestOptions = {},
  ): Promise<ListEmailsResponse> {
    return this.postbound.get<ListEmailsResponseSuccess>(
      withPagination(buildPath('emails'), options, {
        status: options.status,
        q: options.q,
      }),
      requestOptions,
    );
  }

  update(
    payload: UpdateEmailOptions,
    requestOptions: RequestOptions = {},
  ): Promise<UpdateEmailResponse> {
    return this.postbound.patch<UpdateEmailResponseSuccess>(
      buildPath('emails', payload.id),
      { scheduled_at: payload.scheduledAt },
      requestOptions,
    );
  }

  cancel(
    id: string,
    requestOptions: RequestOptions = {},
  ): Promise<CancelEmailResponse> {
    return this.postbound.post<CancelEmailResponseSuccess>(
      buildPath('emails', id, 'cancel'),
      undefined,
      requestOptions,
    );
  }
}
