export type ErrorCode =
  | 'validation_error'
  | 'missing_required_field'
  | 'invalid_parameter'
  | 'invalid_from_address'
  | 'invalid_scheduled_date'
  | 'invalid_attachment'
  | 'invalid_json'
  | 'invalid_state'
  | 'invalid_idempotent_request'
  | 'concurrent_idempotent_requests'
  | 'invalid_download_link'
  | 'missing_api_key'
  | 'invalid_api_key'
  | 'restricted_api_key'
  | 'forbidden'
  | 'not_found'
  | 'method_not_allowed'
  | 'domain_already_exists'
  | 'contact_already_exists'
  | 'verification_conflict'
  | 'domain_verification_unavailable'
  | 'rate_limit_exceeded'
  | 'internal_server_error'
  | 'application_error';

export type ErrorResponse = {
  message: string;
  statusCode: number | null;
  name: ErrorCode;
  request_id?: string;
};

export type Response<T> = (
  | {
      data: T;
      error: null;
    }
  | { error: ErrorResponse; data: null }
) & {
  headers: Record<string, string> | null;
};

export type Tag = { name: string; value: string };
