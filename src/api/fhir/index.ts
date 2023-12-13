import { sendRequestWithRpt } from 'api';
import { getFhirPractitionerId } from 'auth/keycloak';
import { ANALYSIS_ENTITY_QUERY } from 'graphql/prescriptions/queries';

import EnvironmentVariables from 'utils/EnvVariables';

import { Bundle, PractitionerRole, ServiceRequestCode, ServiceRequestEntity } from './models';

const FHIR_API_URL = EnvironmentVariables.configFor('FHIR_API');
export const FHIR_GRAPHQL_URL = `${FHIR_API_URL}/$graphql?_count=1000`;

const searchPractitionerRole = () =>
  sendRequestWithRpt<Bundle<PractitionerRole>>({
    method: 'GET',
    url: `${FHIR_API_URL}/PractitionerRole`,
    params: {
      practitioner: getFhirPractitionerId(),
      _include: 'PractitionerRole:practitioner',
    },
  });

export const fetchServiceRequestEntity = (id: string) =>
  sendRequestWithRpt<{ data: { ServiceRequest: ServiceRequestEntity } }>({
    method: 'POST',
    url: FHIR_GRAPHQL_URL,
    data: {
      query: ANALYSIS_ENTITY_QUERY(id).loc?.source.body,
      variables: {
        requestId: id,
      },
    },
  });

const fetchServiceRequestCodes = () =>
  sendRequestWithRpt<ServiceRequestCode>({
    method: 'GET',
    url: `${FHIR_API_URL}/CodeSystem/analysis-request-code`,
  });

export const FhirApi = {
  searchPractitionerRole,
  fetchServiceRequestCodes,
  fetchServiceRequestEntity,
};
