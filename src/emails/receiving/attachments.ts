import type { RequestOptions } from '../../common/interfaces';
import { buildPath } from '../../common/utils/build-path';
import { withPagination } from '../../common/utils/with-query';
import type { Postbound } from '../../postbound';
import type {
  GetAttachmentOptions,
  GetAttachmentResponse,
  GetAttachmentResponseSuccess,
  ListAttachmentsOptions,
  ListAttachmentsResponse,
  ListAttachmentsResponseSuccess,
} from './interfaces';

export class ReceivingAttachments {
  constructor(private readonly postbound: Postbound) {}

  get(
    options: GetAttachmentOptions,
    requestOptions: RequestOptions = {},
  ): Promise<GetAttachmentResponse> {
    return this.postbound.get<GetAttachmentResponseSuccess>(
      buildPath(
        'emails',
        'receiving',
        options.emailId,
        'attachments',
        options.id,
      ),
      requestOptions,
    );
  }

  list(
    options: ListAttachmentsOptions,
    requestOptions: RequestOptions = {},
  ): Promise<ListAttachmentsResponse> {
    return this.postbound.get<ListAttachmentsResponseSuccess>(
      withPagination(
        buildPath('emails', 'receiving', options.emailId, 'attachments'),
        options,
      ),
      requestOptions,
    );
  }
}
