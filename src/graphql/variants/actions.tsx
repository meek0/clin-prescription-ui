import { DocumentNode } from '@apollo/client';
import { IQueryOperationsConfig } from '@ferlab/ui/core/graphql/types';
import { computeSearchAfter, hydrateResults } from '@ferlab/ui/core/graphql/utils';
import { IQueryResults } from 'graphql/models';
import { QueryVariable } from 'graphql/queries';

import useLazyResultQuery from 'hooks/graphql/useLazyResultQuery';

import { IVariantResultTree, VariantEntity } from './models';
import { VARIANT_QUERY } from './queries';

export const useVariants = (
  variables?: QueryVariable,
  operations?: IQueryOperationsConfig,
  query: DocumentNode = VARIANT_QUERY,
): IQueryResults<VariantEntity[]> => {
  const { error, loading, result } = useLazyResultQuery<IVariantResultTree>(query, {
    variables,
  });

  return {
    error,
    loading,
    data: hydrateResults(result?.Variants?.hits?.edges || [], operations?.previous),
    total: result?.Variants?.hits?.total || 0,
    searchAfter: computeSearchAfter(result?.Variants?.hits?.edges || [], operations),
  };
};
