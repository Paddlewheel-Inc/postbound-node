import type { RequestOptions } from '../../common/interfaces';
import { buildPath } from '../../common/utils/build-path';
import { withPagination, withQuery } from '../../common/utils/with-query';
import type { Postbound } from '../../postbound';
import { ReceivingAttachments } from './attachments';
import type {
  GetReceivingEmailOptions,
  GetReceivingEmailResponse,
  GetReceivingEmailResponseSuccess,
  ListReceivingEmailsOptions,
  ListReceivingEmailsResponse,
  ListReceivingEmailsResponseSuccess,
} from './interfaces';

export class Receiving {
  readonly attachments: ReceivingAttachments;

  constructor(private readonly postbound: Postbound) {
    this.attachments = new ReceivingAttachments(postbound);
  }

  get(
    id: string,
    options: GetReceivingEmailOptions = {},
    requestOptions: RequestOptions = {},
  ): Promise<GetReceivingEmailResponse> {
    return this.postbound.get<GetReceivingEmailResponseSuccess>(
      withQuery(buildPath('emails', 'receiving', id), {
        html_format: options.html_format,
      }),
      requestOptions,
    );
  }

  list(
    options: ListReceivingEmailsOptions = {},
    requestOptions: RequestOptions = {},
  ): Promise<ListReceivingEmailsResponse> {
    return this.postbound.get<ListReceivingEmailsResponseSuccess>(
      withPagination(buildPath('emails', 'receiving'), options),
      requestOptions,
    );
  }
}
