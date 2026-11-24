import { Webhook } from 'standardwebhooks';
import type {
  IdempotentRequestOptions,
  RequestOptions,
} from '../common/interfaces';
import { buildPath } from '../common/utils/build-path';
import { withPagination } from '../common/utils/with-query';
import type { Postbound } from '../postbound';
import type { WebhookEventPayload } from './events';
import type {
  CreateWebhookOptions,
  CreateWebhookResponse,
  CreateWebhookResponseSuccess,
  GetWebhookResponse,
  GetWebhookResponseSuccess,
  ListWebhooksOptions,
  ListWebhooksResponse,
  ListWebhooksResponseSuccess,
  RemoveWebhookResponse,
  RemoveWebhookResponseSuccess,
  TestWebhookResponse,
  TestWebhookResponseSuccess,
  UpdateWebhookOptions,
  UpdateWebhookResponse,
  UpdateWebhookResponseSuccess,
  VerifyWebhookOptions,
} from './interfaces';

export class Webhooks {
  constructor(private readonly postbound: Postbound) {}

  create(
    payload: CreateWebhookOptions,
    requestOptions: IdempotentRequestOptions = {},
  ): Promise<CreateWebhookResponse> {
    return this.postbound.post<CreateWebhookResponseSuccess>(
      buildPath('webhooks'),
      payload,
      requestOptions,
    );
  }

  get(
    id: string,
    requestOptions: RequestOptions = {},
  ): Promise<GetWebhookResponse> {
    return this.postbound.get<GetWebhookResponseSuccess>(
      buildPath('webhooks', id),
      requestOptions,
    );
  }

  list(
    options: ListWebhooksOptions = {},
    requestOptions: RequestOptions = {},
  ): Promise<ListWebhooksResponse> {
    return this.postbound.get<ListWebhooksResponseSuccess>(
      withPagination(buildPath('webhooks'), options),
      requestOptions,
    );
  }

  update(
    id: string,
    payload: UpdateWebhookOptions,
    requestOptions: RequestOptions = {},
  ): Promise<UpdateWebhookResponse> {
    return this.postbound.patch<UpdateWebhookResponseSuccess>(
      buildPath('webhooks', id),
      payload,
      requestOptions,
    );
  }

  remove(
    id: string,
    requestOptions: RequestOptions = {},
  ): Promise<RemoveWebhookResponse> {
    return this.postbound.delete<RemoveWebhookResponseSuccess>(
      buildPath('webhooks', id),
      requestOptions,
    );
  }

  test(
    id: string,
    requestOptions: IdempotentRequestOptions = {},
  ): Promise<TestWebhookResponse> {
    return this.postbound.post<TestWebhookResponseSuccess>(
      buildPath('webhooks', id, 'test'),
      undefined,
      requestOptions,
    );
  }

  verify(options: VerifyWebhookOptions): WebhookEventPayload {
    const webhook = new Webhook(options.webhookSecret);

    return webhook.verify(options.payload, {
      'webhook-id': options.headers.id,
      'webhook-timestamp': options.headers.timestamp,
      'webhook-signature': options.headers.signature,
    }) as WebhookEventPayload;
  }
}
