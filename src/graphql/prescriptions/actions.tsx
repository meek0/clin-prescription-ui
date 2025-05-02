import { IQueryOperationsConfig, IQueryVariable } from '@ferlab/ui/core/graphql/types';
import { computeSearchAfter, hydrateResults } from '@ferlab/ui/core/graphql/utils';
import { GqlResults } from 'graphql/models';
import { AnalysisResult } from 'graphql/prescriptions/models/Prescription';
import { useLazyResultQuery } from 'graphql/utils/query';

import { PRESCRIPTIONS_QUERY, PRESCRIPTIONS_SEARCH_QUERY } from './queries';

export const usePrescription = (
  variables?: IQueryVariable,
  operations?: IQueryOperationsConfig,
): GqlResults<AnalysisResult> => {
  const { loading, result } = useLazyResultQuery<any>(PRESCRIPTIONS_QUERY, {
    variables: variables,
  });
  const prescriptions = result?.Analyses;
  return {
    aggregations: prescriptions?.aggregations || {},
    data: hydrateResults(prescriptions?.hits?.edges || [], operations?.previous),
    loading,
    total: prescriptions?.hits.total,
    searchAfter: computeSearchAfter(prescriptions?.hits?.edges || [], operations),
  };
};

export const usePractitionnerPrescriptions = (
  variables?: IQueryVariable,
  operations?: IQueryOperationsConfig,
): GqlResults<AnalysisResult> => {
  const { loading, result } = useLazyResultQuery<any>(PRESCRIPTIONS_SEARCH_QUERY, {
    variables: variables,
    fetchPolicy: 'no-cache',
  });
  const prescriptions = result?.Analyses;
  return {
    aggregations: prescriptions?.aggregations || {},
    data: hydrateResults(prescriptions?.hits?.edges || [], operations?.previous),
    loading,
    total: prescriptions?.hits.total,
    searchAfter: computeSearchAfter(prescriptions?.hits?.edges || [], operations),
  };
};
