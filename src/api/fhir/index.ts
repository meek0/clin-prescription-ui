import { sendRequestWithRpt } from 'api';
import { getFhirPractitionerId } from 'auth/keycloak';

import EnvironmentVariables from 'utils/EnvVariables';

import { Bundle, Practitioner, PractitionerRole, ServiceRequestCode } from './models';

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

const searchPractitionerRoles = () =>
  sendRequestWithRpt<Bundle<PractitionerRole | Practitioner>>({
    method: 'GET',
    // eslint-disable-next-line max-len
    url: `${FHIR_API_URL}/PractitionerRole?role=doctor,310189009&_include=PractitionerRole:organization&_include=PractitionerRole:practitioner&&_count=1000`,
  });

export const FhirApi = {
  searchPractitionerRole,
  fetchServiceRequestCodes,
  searchPractitionerRoles,
};
