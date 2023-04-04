import { getPositionAt } from 'utils/helper';

export const FHIR_TASK_ID_PREFIX = 'Task/';
export const FHIR_PATIENT_ID_PREFIX = 'Patient/';
export const FHIR_SR_ID_PREFIX = 'ServiceRequest/';
export const FHIR_ORG_ID_PREFIX = 'Organization/';
export const FHIR_SPECIMEN_ID_PREFIX = 'Specimen/';

const extractIdIfThere = (id: string, prefix: string) =>
  id && id.startsWith(prefix)
    ? id.substring(prefix.length, getPositionAt(id, '/', 2) ?? prefix.length)
    : id;

export const extractTaskId = (taskId: string) => extractIdIfThere(taskId, FHIR_TASK_ID_PREFIX);

export const extractSpecimenId = (specimenId: string) =>
  extractIdIfThere(specimenId, FHIR_SPECIMEN_ID_PREFIX);

export const extractPatientId = (patientId: string) =>
  extractIdIfThere(patientId, FHIR_PATIENT_ID_PREFIX);

export const extractServiceRequestId = (srId: string) => extractIdIfThere(srId, FHIR_SR_ID_PREFIX);

export const extractOrganizationId = (orgId: string) => extractIdIfThere(orgId, FHIR_ORG_ID_PREFIX);
