import type * as React from 'react';
import type {
  IdempotentRequestOptions,
  List,
  PaginationOptions,
  RequireAtLeastOne,
  ResourceReference,
} from '../common/interfaces';
import type { Response, Tag } from '../interfaces';

export type EmailEvent =
  | 'queued'
  | 'scheduled'
  | 'sent'
  | 'delivered'
  | 'delivery_delayed'
  | 'bounced'
  | 'complained'
  | 'opened'
  | 'clicked'
  | 'failed'
  | 'canceled';

export interface Attachment {
  content?: string | Uint8Array | ArrayBuffer;
  filename?: string;
  path?: string;
  contentType?: string;
  contentId?: string;
}

export interface EmailApiAttachment {
  content?: string;
  filename?: string;
  path?: string;
  content_type?: string;
  content_id?: string;
}

export interface CreateEmailBaseOptions {
  from: string;
  to: string | string[];
  subject: string;
  cc?: string | string[];
  bcc?: string | string[];
  replyTo?: string | string[];
  headers?: Record<string, string>;
  tags?: Tag[];
  attachments?: Attachment[];
  scheduledAt?: string;
}

export type EmailContentOptions = RequireAtLeastOne<{
  react: React.ReactNode;
  html: string;
  text: string;
}>;

export type CreateEmailOptions = CreateEmailBaseOptions & EmailContentOptions;

export interface EmailApiOptions {
  from: string;
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  cc?: string | string[];
  bcc?: string | string[];
  reply_to?: string | string[];
  headers?: Record<string, string>;
  tags?: Tag[];
  attachments?: EmailApiAttachment[];
  scheduled_at?: string;
}

export type CreateEmailRequestOptions = IdempotentRequestOptions;

export interface CreateEmailResponseSuccess {
  id: string;
}

export type CreateEmailResponse = Response<CreateEmailResponseSuccess>;

export interface EmailEventRecord {
  type: EmailEvent;
  occurred_at: string;
  metadata: Record<string, string>;
}

export interface GetEmailResponseSuccess {
  object: 'email';
  id: string;
  to: string[];
  from: string;
  created_at: string;
  subject: string;
  html: string | null;
  text: string | null;
  bcc: string[] | null;
  cc: string[] | null;
  reply_to: string[] | null;
  last_event: EmailEvent;
  scheduled_at: string | null;
  tags: Tag[] | null;
  events: EmailEventRecord[];
}

export type GetEmailResponse = Response<GetEmailResponseSuccess>;

export type ListEmailsOptions = PaginationOptions & {
  status?: EmailEvent;
  q?: string;
};

export interface EmailListItem {
  id: string;
  to: string[];
  from: string;
  created_at: string;
  subject: string;
  bcc: string[] | null;
  cc: string[] | null;
  reply_to: string[] | null;
  last_event: EmailEvent;
  scheduled_at: string | null;
}

export type ListEmailsResponseSuccess = List<EmailListItem>;

export type ListEmailsResponse = Response<ListEmailsResponseSuccess>;

export interface UpdateEmailOptions {
  id: string;
  scheduledAt: string;
}

export type UpdateEmailResponseSuccess = ResourceReference<'email'>;

export type UpdateEmailResponse = Response<UpdateEmailResponseSuccess>;

export type CancelEmailResponseSuccess = ResourceReference<'email'>;

export type CancelEmailResponse = Response<CancelEmailResponseSuccess>;
