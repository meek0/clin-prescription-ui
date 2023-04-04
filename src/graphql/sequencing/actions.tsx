import { ISyntheticSqon, IValueFilter } from '@ferlab/ui/core/data/sqon/types';
import { IQueryOperationsConfig, IQueryVariable } from '@ferlab/ui/core/graphql/types';
import { computeSearchAfter, hydrateResults } from '@ferlab/ui/core/graphql/utils';
import { GqlResults } from 'graphql/models';
import { useLazyResultQuery } from 'graphql/utils/query';
import cloneDeep from 'lodash/cloneDeep';

import { SequencingResult } from './models';
import { SEQUENCING_QUERY } from './queries';

export const setPrescriptionStatusInActiveQuery = (activeQuery: ISyntheticSqon): ISyntheticSqon => {
  const newActiveQuery = cloneDeep(activeQuery);

  return {
    ...newActiveQuery,
    content: newActiveQuery.content.map((c) => {
      if (!(c as IValueFilter)) {
        return c;
      }

      const contentTmp: IValueFilter = c as IValueFilter;
      if (contentTmp.content.field === 'status') {
        contentTmp.content.field = 'prescription_status';
      }
      return contentTmp;
    }),
  };
};

export const useSequencingRequests = (
  variables: IQueryVariable,
  operations?: IQueryOperationsConfig,
): GqlResults<SequencingResult> => {
  const { loading, result } = useLazyResultQuery<any>(SEQUENCING_QUERY, {
    variables: variables,
  });
  const sequencings = result?.Sequencings;
  return {
    aggregations: sequencings?.aggregations || {},
    data: hydrateResults(sequencings?.hits?.edges || [], operations?.previous),
    loading,
    total: sequencings?.hits.total,
    searchAfter: computeSearchAfter(sequencings?.hits?.edges || [], operations),
  };
};
