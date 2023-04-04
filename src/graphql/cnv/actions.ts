import { DocumentNode } from '@apollo/client';
import { IQueryOperationsConfig, IQueryVariable } from '@ferlab/ui/core/graphql/types';
import { computeSearchAfter, hydrateResults } from '@ferlab/ui/core/graphql/utils';
import { IQueryResults } from 'graphql/models';

import useLazyResultQuery from 'hooks/graphql/useLazyResultQuery';

import { IVariantResultTree, VariantEntity } from './models';
import { VARIANT_QUERY } from './queries';

export const useVariants = (
  variables?: IQueryVariable,
  operations?: IQueryOperationsConfig,
  query: DocumentNode = VARIANT_QUERY,
): IQueryResults<VariantEntity[]> => {
  const { error, loading, result } = useLazyResultQuery<IVariantResultTree>(query, {
    variables,
  });
  return {
    error,
    loading,
    data: hydrateResults(result?.cnv?.hits?.edges || [], operations?.previous),
    total: result?.cnv?.hits?.total || 0,
    searchAfter: computeSearchAfter(result?.cnv?.hits?.edges || [], operations),
  };
};
