import type { Tag } from '../interfaces';

export type EmailWebhookEvent =
  | 'email.sent'
  | 'email.delivered'
  | 'email.delivery_delayed'
  | 'email.bounced'
  | 'email.complained'
  | 'email.opened'
  | 'email.clicked'
  | 'email.failed';

export type DomainWebhookEvent = 'domain.verified' | 'domain.failed';

export type WebhookEvent =
  | EmailWebhookEvent
  | DomainWebhookEvent
  | 'email.received';

export interface EmailEventData {
  email_id: string;
  from: string;
  to: string[];
  subject: string;
  tags: Tag[];
  created_at: string;
  metadata?: Record<string, string>;
}

export interface EmailEventPayload<Type extends EmailWebhookEvent> {
  type: Type;
  created_at: string;
  data: EmailEventData;
}

export interface ReceivedEmailEventAttachment {
  id: string;
  filename: string;
  content_type: string;
  content_disposition: string | null;
  content_id: string | null;
}

export interface EmailReceivedEventPayload {
  type: 'email.received';
  created_at: string;
  data: {
    email_id: string;
    created_at: string;
    from: string;
    to: string[];
    cc: string[];
    bcc: string[];
    received_for: string[];
    message_id: string;
    subject: string;
    attachments: ReceivedEmailEventAttachment[];
  };
}

export interface DomainEventPayload<Type extends DomainWebhookEvent> {
  type: Type;
  created_at: string;
  data: {
    domain_id: string;
    name: string;
    status: string;
    region: string;
  };
}

export interface WebhookTestEventPayload {
  type: 'webhook.test';
  created_at: string;
  data: {
    message: string;
  };
}

export type WebhookEventPayload =
  | EmailEventPayload<'email.sent'>
  | EmailEventPayload<'email.delivered'>
  | EmailEventPayload<'email.delivery_delayed'>
  | EmailEventPayload<'email.bounced'>
  | EmailEventPayload<'email.complained'>
  | EmailEventPayload<'email.opened'>
  | EmailEventPayload<'email.clicked'>
  | EmailEventPayload<'email.failed'>
  | EmailReceivedEventPayload
  | DomainEventPayload<'domain.verified'>
  | DomainEventPayload<'domain.failed'>
  | WebhookTestEventPayload;
