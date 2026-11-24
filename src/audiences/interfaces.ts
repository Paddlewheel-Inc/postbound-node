import type {
  DeletedResource,
  List,
  PaginationOptions,
} from '../common/interfaces';
import type { Response } from '../interfaces';

export interface Audience {
  object: 'audience';
  id: string;
  name: string;
  created_at: string;
}

export interface CreateAudienceOptions {
  name: string;
}

export interface CreateAudienceResponseSuccess {
  object: 'audience';
  id: string;
  name: string;
}

export type CreateAudienceResponse = Response<CreateAudienceResponseSuccess>;

export type GetAudienceResponseSuccess = Audience;

export type GetAudienceResponse = Response<GetAudienceResponseSuccess>;

export type ListAudiencesOptions = PaginationOptions;

export interface AudienceListItem {
  id: string;
  name: string;
  created_at: string;
}

export type ListAudiencesResponseSuccess = List<AudienceListItem>;

export type ListAudiencesResponse = Response<ListAudiencesResponseSuccess>;

export type RemoveAudiencesResponseSuccess = DeletedResource<'audience'>;

export type RemoveAudiencesResponse = Response<RemoveAudiencesResponseSuccess>;
