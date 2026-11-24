import type {
  IdempotentRequestOptions,
  RequestOptions,
} from '../common/interfaces';
import { buildPath } from '../common/utils/build-path';
import { failure } from '../common/utils/failure';
import { withPagination } from '../common/utils/with-query';
import type { Response } from '../interfaces';
import type { Postbound } from '../postbound';
import type {
  ContactReference,
  CreateContactOptions,
  CreateContactResponse,
  CreateContactResponseSuccess,
  GetContactOptions,
  GetContactResponse,
  GetContactResponseSuccess,
  ListContactsOptions,
  ListContactsResponse,
  ListContactsResponseSuccess,
  RemoveContactOptions,
  RemoveContactResponse,
  RemoveContactResponseSuccess,
  UpdateContactOptions,
  UpdateContactResponse,
  UpdateContactResponseSuccess,
} from './interfaces';

export class Contacts {
  constructor(private readonly postbound: Postbound) {}

  create(
    payload: CreateContactOptions,
    requestOptions: IdempotentRequestOptions = {},
  ): Promise<CreateContactResponse> {
    return this.postbound.post<CreateContactResponseSuccess>(
      buildPath('audiences', payload.audienceId, 'contacts'),
      {
        email: payload.email,
        first_name: payload.firstName,
        last_name: payload.lastName,
        unsubscribed: payload.unsubscribed,
      },
      requestOptions,
    );
  }

  get(
    options: GetContactOptions,
    requestOptions: RequestOptions = {},
  ): Promise<GetContactResponse> {
    return this.withContactPath(options, (path) =>
      this.postbound.get<GetContactResponseSuccess>(path, requestOptions),
    );
  }

  list(
    options: ListContactsOptions,
    requestOptions: RequestOptions = {},
  ): Promise<ListContactsResponse> {
    return this.postbound.get<ListContactsResponseSuccess>(
      withPagination(
        buildPath('audiences', options.audienceId, 'contacts'),
        options,
      ),
      requestOptions,
    );
  }

  update(
    options: UpdateContactOptions,
    requestOptions: RequestOptions = {},
  ): Promise<UpdateContactResponse> {
    return this.withContactPath(options, (path) =>
      this.postbound.patch<UpdateContactResponseSuccess>(
        path,
        {
          first_name: options.firstName,
          last_name: options.lastName,
          unsubscribed: options.unsubscribed,
        },
        requestOptions,
      ),
    );
  }

  remove(
    options: RemoveContactOptions,
    requestOptions: RequestOptions = {},
  ): Promise<RemoveContactResponse> {
    return this.withContactPath(options, (path) =>
      this.postbound.delete<RemoveContactResponseSuccess>(path, requestOptions),
    );
  }

  private withContactPath<T>(
    reference: ContactReference,
    run: (path: string) => Promise<Response<T>>,
  ): Promise<Response<T>> {
    const contact = reference.id ?? reference.email;

    if (!contact) {
      return Promise.resolve(
        failure<T>({
          name: 'missing_required_field',
          statusCode: null,
          message: 'Missing `id` or `email` field.',
        }),
      );
    }

    return run(
      buildPath('audiences', reference.audienceId, 'contacts', contact),
    );
  }
}
