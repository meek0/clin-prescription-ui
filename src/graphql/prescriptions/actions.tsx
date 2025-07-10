import { ApolloError } from '@apollo/client';
import { IQueryOperationsConfig, IQueryVariable } from '@ferlab/ui/core/graphql/types';
import { computeSearchAfter, hydrateResults } from '@ferlab/ui/core/graphql/utils';
import { AnalysisTaskEntity, PatientRequest, ServiceRequestEntity } from 'api/fhir/models';
import { GraphQLError } from 'graphql';
import { ExtendedMappingResults, GqlResults } from 'graphql/models';
import { AnalysisResult } from 'graphql/prescriptions/models/Prescription';
import { INDEX_EXTENDED_MAPPING } from 'graphql/queries';
import { useLazyResultQuery, useLazyResultQueryOnLoadOnly } from 'graphql/utils/query';
import { StatusOptions } from 'views/Prescriptions/components/StatusTag';

import {
  ANALYSE_CODESYSTEME,
  ANALYSE_COMPLEX_PARACLINIQUE_OBSERVATION,
  ANALYSE_CON_OBSERVATION,
  ANALYSE_ETH_OBSERVATION,
  ANALYSE_FMH,
  ANALYSE_GENERALOBS_GESTATIONAL_OBSERVATION,
  ANALYSE_GENERALOBS_INDICATION_OBSERVATION,
  ANALYSE_PARACLINIQUE_OBSERVATION,
  ANALYSE_PHENOTYPE_OBSERVATION,
  ANALYSE_SOCIAL_HISTORY_OBSERVATION,
  ANALYSE_VALUESET,
  ANALYSIS_ENTITY_QUERY,
  ANALYSIS_TASK_QUERY,
  PRESCRIPTIONS_QUERY,
  PRESCRIPTIONS_SEARCH_QUERY,
  SERVICE_REQUEST_QUERY,
} from './queries';

const ANALYSIS_SERVICE_REQUEST_PROFILE =
  'http://fhir.cqgc.ferlab.bio/StructureDefinition/cqgc-analysis-request';

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

export const useCodeSystem = (id: string) => {
  const { data } = useLazyResultQueryOnLoadOnly<any>(ANALYSE_CODESYSTEME(id), {
    variables: {
      id: id,
    },
  });
  return {
    codeInfo: data?.CodeSystem,
  };
};
export const useValueSet = (id: string) => {
  const { data } = useLazyResultQueryOnLoadOnly<any>(ANALYSE_VALUESET(id), {
    variables: {
      id: id,
    },
  });
  return {
    valueSet: data?.ValueSet,
  };
};

export const useObservationEthnicityEntity = (id: string) => {
  const { data } = useLazyResultQueryOnLoadOnly<any>(ANALYSE_ETH_OBSERVATION(id), {
    variables: {
      id: id,
    },
  });
  return {
    ethValue: data?.Observation,
  };
};

export const useObservationSocialHistoryEntity = (id: string) => {
  const { data } = useLazyResultQueryOnLoadOnly<any>(ANALYSE_SOCIAL_HISTORY_OBSERVATION(id), {
    variables: {
      id: id,
    },
  });
  return {
    socialHistoryValue: data?.Observation,
  };
};

export const useObservationConsanguinityEntity = (id: string) => {
  const { data } = useLazyResultQueryOnLoadOnly<any>(ANALYSE_CON_OBSERVATION(id), {
    variables: {
      id: id,
    },
  });
  return {
    conValue: data?.Observation,
  };
};

export const useObservationPhenotypeEntity = (ids: string[]) => {
  if (!ids?.length) return { phenotypeValue: [] };
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { data } = useLazyResultQueryOnLoadOnly<any>(ANALYSE_PHENOTYPE_OBSERVATION(ids), {
    variables: {
      ids: ids,
    },
  });
  return {
    phenotypeValue: data?.Observation,
  };
};

export const useFamilyHistoryEntity = (ids: string[]) => {
  const { data } = useLazyResultQueryOnLoadOnly<any>(ANALYSE_FMH(ids), {
    variables: {
      ids: ids,
    },
  });
  return {
    familyHistory: data?.FamilyMemberHistory,
  };
};

export const useGeneralObservationEntity = (ids: string[]) => {
  const { data } = useLazyResultQueryOnLoadOnly<any>(
    ANALYSE_GENERALOBS_INDICATION_OBSERVATION(ids),
    {
      variables: {
        ids: ids,
      },
    },
  );
  return {
    generalObervationValue: data?.Observation,
  };
};

export const useGestationalDateObservationEntity = (id: string) => {
  const { data } = useLazyResultQueryOnLoadOnly<any>(
    ANALYSE_GENERALOBS_GESTATIONAL_OBSERVATION(id),
    {
      variables: {
        id: id,
      },
    },
  );
  return {
    gestationalDateObervationValue: data?.Observation,
  };
};

export const useObservationParacliniqueEntity = (ids: string[] | null) => {
  const { data } = useLazyResultQueryOnLoadOnly<any>(ANALYSE_PARACLINIQUE_OBSERVATION(ids), {
    variables: {
      ids: ids,
    },
  });
  return {
    paracliniqueValue: data?.Observation,
  };
};

export const useObservationComplexParacliniqueEntity = (ids: string[] | null) => {
  const { data } = useLazyResultQueryOnLoadOnly<any>(
    ANALYSE_COMPLEX_PARACLINIQUE_OBSERVATION(ids),
    {
      variables: {
        ids: ids,
      },
    },
  );
  return {
    complexParacliniqueValue: data?.Observation,
  };
};

export const useServiceRequestEntity = (
  id: string,
): {
  prescription: ServiceRequestEntity | undefined;
  loading: boolean;
  error: ApolloError | undefined;
} => {
  const { loading, data, error } = useLazyResultQueryOnLoadOnly<any>(ANALYSIS_ENTITY_QUERY(id), {
    skip: !id,
    variables: {
      requestId: id,
    },
  });

  if (
    (!data?.ServiceRequest.meta?.profile?.includes(ANALYSIS_SERVICE_REQUEST_PROFILE) && !error) ||
    data?.ServiceRequest.status === StatusOptions.Draft
  ) {
    const newError = new GraphQLError('Forbidden request', {
      extensions: {
        code: 'FORBIDDEN',
      },
    });

    return {
      prescription: undefined,
      loading,
      error: new ApolloError({ graphQLErrors: [newError] }),
    };
  }

  return {
    prescription: data?.ServiceRequest,
    loading,
    error,
  };
};

export const useBasedOnServiceRequests = (
  id: string,
): {
  serviceRequests: PatientRequest[];
  loading: boolean;
  error: ApolloError | undefined;
} => {
  const { loading, data, error } = useLazyResultQueryOnLoadOnly<any>(SERVICE_REQUEST_QUERY(id), {
    skip: !id,
    variables: {
      requestId: id,
    },
  });

  return {
    serviceRequests: data?.ServiceRequestList || [],
    loading,
    error,
  };
};

export const useTaskEntity = (
  id: string,
): {
  task: AnalysisTaskEntity | undefined;
  loading: boolean;
  error: ApolloError | undefined;
} => {
  const { loading, data, error } = useLazyResultQueryOnLoadOnly<any>(ANALYSIS_TASK_QUERY(id), {
    skip: !id,
    variables: {
      taskId: id,
    },
  });

  return {
    task: data?.Task,
    loading,
    error,
  };
};

export const usePrescriptionMapping = (): ExtendedMappingResults => {
  const { loading, result } = useLazyResultQuery<any>(INDEX_EXTENDED_MAPPING('Analyses'), {
    fetchPolicy: 'no-cache',
    variables: [],
  });

  return {
    data: result?.Analyses.extended || [],
    loading: loading,
  };
};
