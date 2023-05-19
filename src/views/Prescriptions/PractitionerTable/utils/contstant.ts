import { SortDirection } from '@ferlab/ui/core/graphql/constants';
import { IQueryConfig, ISort } from '@ferlab/ui/core/graphql/types';

export const MAX_NUMBER_RESULTS = 1000;
export const PRESCRIPTION_QB_ID = 'prescription-repo';
export const PRESCRIPTION_SCROLL_ID = 'prescription-scroll-id';

export const SEQUENCING_QB_ID = 'sequecing-repo';
export const SEQUENCING_SCROLL_ID = 'sequencing-scroll-id';

export const DEFAULT_PAGE_SIZE = 20;
export const DEFAULT_PAGE = 1;
export const DEFAULT_OFFSET = 0;
export const DEFAULT_PAGE_INDEX = 1;

export const DEFAULT_SORT_QUERY = [
  { field: 'created_on', order: SortDirection.Desc },
  { field: '_id', order: SortDirection.Desc },
] as ISort[];

export const DEFAULT_QUERY_CONFIG: IQueryConfig = {
  pageIndex: DEFAULT_OFFSET,
  size: DEFAULT_PAGE_SIZE,
  sort: DEFAULT_SORT_QUERY,
  searchAfter: undefined,
  firstPageFlag: undefined,
  operations: undefined,
};

export enum TableTabs {
  Prescriptions = 'prescriptions',
  Requests = 'requests',
}
