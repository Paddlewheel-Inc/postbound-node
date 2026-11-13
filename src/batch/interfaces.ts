import type {
  CreateEmailBaseOptions,
  EmailContentOptions,
} from '../emails/interfaces';
import type { Response } from '../interfaces';

export type BatchEmailOptions = Omit<
  CreateEmailBaseOptions,
  'attachments' | 'scheduledAt'
> &
  EmailContentOptions;

export type CreateBatchOptions = BatchEmailOptions[];

export interface CreateBatchResponseSuccess {
  data: { id: string }[];
}

export type CreateBatchResponse = Response<CreateBatchResponseSuccess>;
