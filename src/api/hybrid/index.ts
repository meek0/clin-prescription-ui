import { sendRequestWithRpt } from 'api';
import { ISupervisor } from 'api/form/models';

import EnvironmentVariables from 'utils/EnvVariables';

import { HybridAnalysis, IHybridPatientForm } from './models';

export const HYBRID_API_URL = `${EnvironmentVariables.configFor('HYBRID_API_URL')}`;

const headers = {
  'Content-Type': 'application/json',
};

async function getPrescription(prescriptionId: string) {
  const { data, error } = await sendRequestWithRpt<HybridAnalysis>({
    method: 'GET',
    url: `${HYBRID_API_URL}/analysis/${prescriptionId}`,
    headers,
  });

  return { data, error };
}

const createPrescription = (data: HybridAnalysis, isDraft?: boolean) =>
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

const updatePrescription = (data: HybridAnalysis, prescriptionId: string, isDraft?: boolean) =>
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
  organization_id,
  mrn,
  jhn,
}: {
  organization_id?: string;
  mrn?: string;
  jhn?: string;
}) =>
  sendRequestWithRpt<IHybridPatientForm>({
    method: 'GET',
    url: `${HYBRID_API_URL}/search/patient`,
    params: {
      organization_id,
      mrn,
      jhn,
    },
    headers,
  });

const searchPatients = ({ mrn, jhn }: { mrn?: string; jhn?: string }) =>
  sendRequestWithRpt<{ patients: IHybridPatientForm[] }>({
    method: 'GET',
    url: `${HYBRID_API_URL}/search/patients`,
    params: {
      mrn,
      jhn,
    },
    headers: { ...headers, 'Cache-Control': 'no-cache' }, // Disable caching for patient search https://ferlab-crsj.atlassian.net/browse/CLIN-4679
  });

const getProjectList = () =>
  sendRequestWithRpt<{
    codes: {
      code: string;
      description: string;
    }[];
  }>({
    method: 'GET',
    url: `${HYBRID_API_URL}/list/codes/project?lang=en`,
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
  searchPatients,
  searchSupervisors,
  getProjectList,
};
