import { sendRequestWithRpt } from 'api';

import EnvironmentVariables from 'utils/EnvVariables';

import { HybridPrescription } from './models';

export const HYBRID_API_URL = `${EnvironmentVariables.configFor('HYBRID_API_URL')}`;

const headers = {
  'Content-Type': 'application/json',
};

const getPrescription = (prescriptionId: string) =>
  sendRequestWithRpt<HybridPrescription>({
    method: 'GET',
    url: `${HYBRID_API_URL}/analysis/${prescriptionId}`,
    headers,
  });

export const HybridApi = {
  getPrescription,
};
