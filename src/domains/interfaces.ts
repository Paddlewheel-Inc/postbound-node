import type {
  DeletedResource,
  List,
  PaginationOptions,
  ResourceReference,
} from '../common/interfaces';
import type { Response } from '../interfaces';

export type DomainStatus = 'not_started' | 'pending' | 'verified' | 'failed';

export type DomainTls = 'opportunistic' | 'enforced';

export type DomainCapability = 'enabled' | 'disabled';

export interface DomainCapabilities {
  sending: DomainCapability;
  receiving: DomainCapability;
}

export interface DomainRecord {
  record: 'Ownership' | 'DKIM' | 'SPF' | 'Receiving';
  name: string;
  type: 'TXT' | 'MX';
  ttl: string;
  status: DomainStatus;
  value: string;
  priority?: number;
}

export interface Domain {
  object: 'domain';
  id: string;
  name: string;
  status: DomainStatus;
  created_at: string;
  region: string;
  custom_return_path: string;
  open_tracking: boolean;
  click_tracking: boolean;
  tls: DomainTls;
  capabilities: DomainCapabilities;
  records: DomainRecord[];
}

export interface CreateDomainOptions {
  name: string;
  region?: string;
  customReturnPath?: string;
}

export type CreateDomainResponseSuccess = Domain;

export type CreateDomainResponse = Response<CreateDomainResponseSuccess>;

export type GetDomainResponseSuccess = Domain;

export type GetDomainResponse = Response<GetDomainResponseSuccess>;

export type ListDomainsOptions = PaginationOptions;

export interface DomainListItem {
  id: string;
  name: string;
  status: DomainStatus;
  created_at: string;
  region: string;
}

export type ListDomainsResponseSuccess = List<DomainListItem>;

export type ListDomainsResponse = Response<ListDomainsResponseSuccess>;

export interface UpdateDomainOptions {
  id: string;
  openTracking?: boolean;
  clickTracking?: boolean;
  tls?: DomainTls;
  capabilities?: Partial<DomainCapabilities>;
}

export type UpdateDomainResponseSuccess = ResourceReference<'domain'>;

export type UpdateDomainResponse = Response<UpdateDomainResponseSuccess>;

export type VerifyDomainResponseSuccess = ResourceReference<'domain'>;

export type VerifyDomainResponse = Response<VerifyDomainResponseSuccess>;

export type RemoveDomainResponseSuccess = DeletedResource<'domain'>;

export type RemoveDomainResponse = Response<RemoveDomainResponseSuccess>;
