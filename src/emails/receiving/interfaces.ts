import type { List, PaginationOptions } from '../../common/interfaces';
import type { Response } from '../../interfaces';

export type HtmlFormat = 'data_uri' | 'cid';

export type AuthenticationResult =
  | 'pass'
  | 'fail'
  | 'gray'
  | 'processing_failed'
  | 'unknown';

export interface ReceivedEmailAuthentication {
  spf: AuthenticationResult;
  dkim: AuthenticationResult;
  dmarc: AuthenticationResult;
}

export interface ReceivedAttachmentSummary {
  id: string;
  filename: string;
  content_type: string;
  content_disposition: string | null;
  content_id: string | null;
  size: number;
}

export interface SignedDownload {
  download_url: string;
  expires_at: string;
}

export interface GetReceivingEmailOptions {
  html_format?: HtmlFormat;
}

export interface GetReceivingEmailResponseSuccess {
  object: 'email';
  id: string;
  to: string[];
  from: string;
  created_at: string;
  subject: string;
  html: string | null;
  html_format: HtmlFormat;
  text: string | null;
  headers: Record<string, string>;
  bcc: string[] | null;
  cc: string[] | null;
  reply_to: string[] | null;
  received_for: string[];
  authentication: ReceivedEmailAuthentication;
  message_id: string;
  raw: SignedDownload;
  attachments: ReceivedAttachmentSummary[];
}

export type GetReceivingEmailResponse =
  Response<GetReceivingEmailResponseSuccess>;

export type ListReceivingEmailsOptions = PaginationOptions;

export interface ReceivedEmailListItem {
  id: string;
  to: string[];
  from: string;
  subject: string;
  created_at: string;
  message_id: string;
  attachments_count: number;
}

export type ListReceivingEmailsResponseSuccess = List<ReceivedEmailListItem>;

export type ListReceivingEmailsResponse =
  Response<ListReceivingEmailsResponseSuccess>;

export interface ReceivedAttachment
  extends ReceivedAttachmentSummary,
    SignedDownload {}

export interface GetAttachmentOptions {
  emailId: string;
  id: string;
}

export interface GetAttachmentResponseSuccess extends ReceivedAttachment {
  object: 'attachment';
}

export type GetAttachmentResponse = Response<GetAttachmentResponseSuccess>;

export type ListAttachmentsOptions = PaginationOptions & {
  emailId: string;
};

export type ListAttachmentsResponseSuccess = List<ReceivedAttachment>;

export type ListAttachmentsResponse = Response<ListAttachmentsResponseSuccess>;
