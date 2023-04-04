import { sendRequestWithRpt } from 'api';

import { TCompleteAnalysis } from 'store/prescription/types';
import EnvironmentVariables from 'utils/EnvVariables';

import { IFormPatient, ISupervisor, TFormConfig } from './models';

const FORM_API_URL = `${EnvironmentVariables.configFor('FORM_API_URL')}`;

const headers = {
  'Content-Type': 'application/json',
};

const fetchConfig = (code: string) =>
  sendRequestWithRpt<{ config: TFormConfig }>({
    method: 'GET',
    url: `${FORM_API_URL}/form/${code}`,
    headers,
  });

const searchPatient = ({ ep, mrn, ramq }: { ep: string; mrn?: string; ramq?: string }) =>
  sendRequestWithRpt<IFormPatient>({
    method: 'GET',
    url: `${FORM_API_URL}/search/patient/${ep}`,
    params: {
      mrn,
      ramq,
    },
    headers,
  });

const searchSupervisor = ({ ep, prefix }: { ep: string; prefix: string }) =>
  sendRequestWithRpt<ISupervisor[]>({
    method: 'GET',
    url: `${FORM_API_URL}/autocomplete/supervisor/${ep}/${prefix}`,
    headers,
  });

const createPrescription = (data: TCompleteAnalysis) =>
  sendRequestWithRpt<{ id: string }>({
    method: 'POST',
    url: `${FORM_API_URL}/form`,
    headers,
    data,
  });

export const PrescriptionFormApi = {
  fetchConfig,
  searchPatient,
  searchSupervisor,
  createPrescription,
};
