import { sendRequestWithRpt } from 'api';
import { IHybridFormPatient, ISupervisor } from 'api/form/models';

import EnvironmentVariables from 'utils/EnvVariables';

import { HybridPrescription } from './models';

export const HYBRID_API_URL = `${EnvironmentVariables.configFor('HYBRID_API_URL')}`;

const headers = {
  'Content-Type': 'application/json',
};

async function getPrescription(prescriptionId: string) {
  const { data, error } = await sendRequestWithRpt<HybridPrescription>({
    method: 'GET',
    url: `${HYBRID_API_URL}/analysis/${prescriptionId}`,
    headers,
  });

  return { data, error };
}

const createPrescription = (data: HybridPrescription, isDraft?: boolean) =>
  sendRequestWithRpt<{
    analysis_id: string;
    patients: {
      id: string;
      family_member: string;
    }[];
  }>({
    method: 'POST',
    url: `${HYBRID_API_URL}/analysis`,
    params: {
      draft: isDraft || null,
    },
    headers,
    data,
  });

const updatePrescription = (data: HybridPrescription, prescriptionId: string, isDraft?: boolean) =>
  sendRequestWithRpt<{
    analysis_id: string;
    patients: {
      id: string;
      family_member: string;
    }[];
  }>({
    method: 'PUT',
    url: `${HYBRID_API_URL}/analysis/${prescriptionId}`,
    params: {
      draft: isDraft || null,
    },
    headers,
    data,
  });

const searchPatient = ({
  organisation_id,
  mrn,
  jhn,
}: {
  organisation_id?: string;
  mrn?: string;
  jhn?: string;
}) =>
  sendRequestWithRpt<IHybridFormPatient>({
    method: 'GET',
    url: `${HYBRID_API_URL}/search/patient`,
    params: {
      organisation_id,
      mrn,
      jhn,
    },
    headers,
  });

const searchSupervisors = ({
  organizationId,
  prefix,
}: {
  organizationId: string;
  prefix: string;
}) =>
  sendRequestWithRpt<ISupervisor>({
    method: 'GET',
    url: `${HYBRID_API_URL}/search/supervisors/${organizationId}/${prefix}`,
    headers,
  });

export const HybridApi = {
  getPrescription,
  createPrescription,
  updatePrescription,
  searchPatient,
  searchSupervisors,
};
