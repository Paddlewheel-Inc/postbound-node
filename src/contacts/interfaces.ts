import type {
  List,
  PaginationOptions,
  ResourceReference,
} from '../common/interfaces';
import type { Response } from '../interfaces';

export type ContactReference = { audienceId: string } & (
  | { id: string; email?: never }
  | { email: string; id?: never }
);

export interface Contact {
  object: 'contact';
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  created_at: string;
  unsubscribed: boolean;
}

export interface CreateContactOptions {
  audienceId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  unsubscribed?: boolean;
}

export type CreateContactResponseSuccess = ResourceReference<'contact'>;

export type CreateContactResponse = Response<CreateContactResponseSuccess>;

export type GetContactOptions = ContactReference;

export type GetContactResponseSuccess = Contact;

export type GetContactResponse = Response<GetContactResponseSuccess>;

export type ListContactsOptions = PaginationOptions & {
  audienceId: string;
};

export interface ContactListItem {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  created_at: string;
  unsubscribed: boolean;
}

export type ListContactsResponseSuccess = List<ContactListItem>;

export type ListContactsResponse = Response<ListContactsResponseSuccess>;

export type UpdateContactOptions = ContactReference & {
  firstName?: string;
  lastName?: string;
  unsubscribed?: boolean;
};

export type UpdateContactResponseSuccess = ResourceReference<'contact'>;

export type UpdateContactResponse = Response<UpdateContactResponseSuccess>;

export type RemoveContactOptions = ContactReference;

export interface RemoveContactResponseSuccess {
  object: 'contact';
  contact: string;
  deleted: true;
}

export type RemoveContactResponse = Response<RemoveContactResponseSuccess>;
