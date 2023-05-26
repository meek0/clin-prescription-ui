import { sendRequestWithRpt } from 'api';
import { getFhirPractitionerId } from 'auth/keycloak';

import EnvironmentVariables from 'utils/EnvVariables';

import { Bundle, PractitionerRole, ServiceRequestCode } from './models';

const FHIR_API_URL = EnvironmentVariables.configFor('FHIR_API');

const searchPractitionerRole = () =>
  sendRequestWithRpt<Bundle<PractitionerRole>>({
    method: 'GET',
    url: `${FHIR_API_URL}/PractitionerRole`,
    params: {
      practitioner: getFhirPractitionerId(),
      _include: 'PractitionerRole:practitioner',
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
};
