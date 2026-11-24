import { render } from '../render';
import type {
  Attachment,
  CreateEmailOptions,
  EmailApiAttachment,
  EmailApiOptions,
} from './interfaces';

function encodeContent(content: Attachment['content']): string | undefined {
  if (content === undefined || typeof content === 'string') {
    return content;
  }

  const bytes =
    content instanceof ArrayBuffer
      ? Buffer.from(content)
      : Buffer.from(content.buffer, content.byteOffset, content.byteLength);

  return bytes.toString('base64');
}

function toAttachmentApiOptions(attachment: Attachment): EmailApiAttachment {
  return {
    content: encodeContent(attachment.content),
    filename: attachment.filename,
    path: attachment.path,
    content_type: attachment.contentType,
    content_id: attachment.contentId,
  };
}

export async function toEmailApiOptions(
  email: CreateEmailOptions,
): Promise<EmailApiOptions> {
  const html = email.react ? await render(email.react) : email.html;

  return {
    from: email.from,
    to: email.to,
    subject: email.subject,
    html,
    text: email.text,
    cc: email.cc,
    bcc: email.bcc,
    reply_to: email.replyTo,
    headers: email.headers,
    tags: email.tags,
    attachments: email.attachments?.map(toAttachmentApiOptions),
    scheduled_at: email.scheduledAt,
  };
}
