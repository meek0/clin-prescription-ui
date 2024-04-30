import { getPositionAt } from 'utils/helper';

export const FHIR_PATIENT_ID_PREFIX = 'Patient/';
export const FHIR_SR_ID_PREFIX = 'ServiceRequest/';
export const FHIR_ORG_ID_PREFIX = 'Organization/';
export const FHIR_OBS_ID_PREFIX = 'Observation/';

const extractIdIfThere = (id: string, prefix: string) =>
  id && id.startsWith(prefix)
    ? id.substring(prefix.length, getPositionAt(id, '/', 2) ?? prefix.length)
    : id;

export const extractPatientId = (patientId: string) =>
  extractIdIfThere(patientId, FHIR_PATIENT_ID_PREFIX);

export const extractServiceRequestId = (srId: string) => extractIdIfThere(srId, FHIR_SR_ID_PREFIX);

export const extractOrganizationId = (orgId: string) => extractIdIfThere(orgId, FHIR_ORG_ID_PREFIX);

export const extractObservationId = (obsId: string) => extractIdIfThere(obsId, FHIR_OBS_ID_PREFIX);
