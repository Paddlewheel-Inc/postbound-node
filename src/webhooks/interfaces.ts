import type {
  DeletedResource,
  List,
  PaginationOptions,
} from '../common/interfaces';
import type { Response } from '../interfaces';
import type { WebhookEvent } from './events';

export type WebhookType = 'http' | 'discord' | 'teams';

export type WebhookDeliveryStatus = 'success' | 'failed';

export interface Webhook {
  id: string;
  type: WebhookType;
  url: string;
  events: WebhookEvent[];
  enabled: boolean;
  created_at: string;
  last_delivery_status: WebhookDeliveryStatus | null;
}

export interface WebhookWithSigningSecret extends Webhook {
  signing_secret?: string;
}

export interface CreateWebhookOptions {
  type?: WebhookType;
  url: string;
  events: WebhookEvent[];
  enabled?: boolean;
}

export type CreateWebhookResponseSuccess = WebhookWithSigningSecret;

export type CreateWebhookResponse = Response<CreateWebhookResponseSuccess>;

export type GetWebhookResponseSuccess = WebhookWithSigningSecret;

export type GetWebhookResponse = Response<GetWebhookResponseSuccess>;

export type ListWebhooksOptions = PaginationOptions;

export type ListWebhooksResponseSuccess = List<Webhook>;

export type ListWebhooksResponse = Response<ListWebhooksResponseSuccess>;

export interface UpdateWebhookOptions {
  url?: string;
  events?: WebhookEvent[];
  enabled?: boolean;
}

export type UpdateWebhookResponseSuccess = Webhook;

export type UpdateWebhookResponse = Response<UpdateWebhookResponseSuccess>;

export type RemoveWebhookResponseSuccess = DeletedResource<'webhook'>;

export type RemoveWebhookResponse = Response<RemoveWebhookResponseSuccess>;

export interface TestWebhookResponseSuccess {
  object: 'webhook_test';
  success: boolean;
  status_code: number | null;
  error: string | null;
}

export type TestWebhookResponse = Response<TestWebhookResponseSuccess>;

export interface VerifyWebhookOptions {
  payload: string;
  headers: {
    id: string;
    timestamp: string;
    signature: string;
  };
  webhookSecret: string;
}
