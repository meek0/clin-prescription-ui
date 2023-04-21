import { gql } from '@apollo/client';
import { ISyntheticSqon } from '@ferlab/ui/core/data/sqon/types';
import { ISearchAfter } from '@ferlab/ui/core/graphql/types';

export type Sort = {
  field: string;
  order: string;
};

export type TSortDirection = 'asc' | 'desc';

export type QueryVariable = {
  sqon: ISyntheticSqon;
  first?: number;
  offset?: number;
  sort?: Sort[];
  pageSize?: number;
  searchAfter?: ISearchAfter[];
};

export const INDEX_EXTENDED_MAPPING = (index: string) => gql`
query ExtendedMapping${index} {
  ${index} {
    extended
  }
}
`;
