import type { IdempotentRequestOptions } from '../common/interfaces';
import { buildPath } from '../common/utils/build-path';
import { toEmailApiOptions } from '../emails/to-email-api-options';
import type { Postbound } from '../postbound';
import type {
  CreateBatchOptions,
  CreateBatchResponse,
  CreateBatchResponseSuccess,
} from './interfaces';

export class Batch {
  constructor(private readonly postbound: Postbound) {}

  send(
    payload: CreateBatchOptions,
    requestOptions: IdempotentRequestOptions = {},
  ): Promise<CreateBatchResponse> {
    return this.create(payload, requestOptions);
  }

  async create(
    payload: CreateBatchOptions,
    requestOptions: IdempotentRequestOptions = {},
  ): Promise<CreateBatchResponse> {
    const emails = await Promise.all(payload.map(toEmailApiOptions));

    return this.postbound.post<CreateBatchResponseSuccess>(
      buildPath('emails', 'batch'),
      emails,
      requestOptions,
    );
  }
}
