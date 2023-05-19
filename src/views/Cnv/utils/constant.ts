import { SortDirection } from '@ferlab/ui/core/graphql/constants';
import { IQueryConfig, ISort } from '@ferlab/ui/core/graphql/types';

export const CNV_VARIANT_PATIENT_QB_ID = 'patient-cnv-repo';

export const SCROLL_WRAPPER_ID = 'cnv-scroll-wrapper';

export const DEFAULT_PAGE_INDEX = 1;
export const DEFAULT_PAGE_SIZE = 20;

export const DEFAULT_OFFSET = 0;

export const DEFAULT_PAGING_CONFIG = {
  index: DEFAULT_PAGE_INDEX,
  size: DEFAULT_PAGE_SIZE,
};

export const DEFAULT_SORT_QUERY = [
  { field: 'sort_chromosome', order: SortDirection.Asc },
  { field: 'start', order: SortDirection.Asc },
] as ISort[];

export const DEFAULT_QUERY_CONFIG: IQueryConfig = {
  pageIndex: DEFAULT_OFFSET,
  size: DEFAULT_PAGE_SIZE,
  sort: DEFAULT_SORT_QUERY,
  searchAfter: undefined,
  firstPageFlag: undefined,
  operations: undefined,
};

export enum FilterTypes {
  Variant,
  Gene,
  Rqdm,
  Occurrence,
}
