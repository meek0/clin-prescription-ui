import { sendRequestWithRpt } from 'api';

import { TCompleteAnalysis } from 'store/prescription/types';
import { LANG } from 'utils/constants';
import EnvironmentVariables from 'utils/EnvVariables';

import { IFormPatient, ISupervisor, TFormConfig } from './models';

export const FORM_API_URL = `${EnvironmentVariables.configFor('FORM_API_URL')}`;

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

const createPrescription = (data: TCompleteAnalysis, isDraft?: boolean) =>
  sendRequestWithRpt<{
    id: string;
    patients: {
      id: string;
      family_member: string;
    }[];
  }>({
    method: 'POST',
    url: `${FORM_API_URL}/form`,
    params: {
      draft: !!isDraft || null,
    },
    headers,
    data,
  });

const updatePrescription = (data: TCompleteAnalysis, prescriptionId: string, isDraft?: boolean) =>
  sendRequestWithRpt<{
    id: string;
    patients: {
      id: string;
      family_member: string;
    }[];
  }>({
    method: 'PUT',
    url: `${FORM_API_URL}/form/${prescriptionId}`,
    params: {
      draft: !!isDraft || null,
    },
    headers,
    data,
  });

const downloadDocuments = (analysis_id: string, lang = LANG.FR) =>
  sendRequestWithRpt({
    method: 'GET',
    url: `${FORM_API_URL}/render/${analysis_id}?format=pdf&lang=${lang}`,
    responseType: 'blob',
  });

const prescriptionShare = (analysis_id: string, roles: string[]) =>
  sendRequestWithRpt<{ analysis_id: string; roles: string[] }>({
    method: 'POST',
    url: `${FORM_API_URL}/share`,
    data: {
      analysis_id: analysis_id,
      roles: roles,
    },
  });

export const PrescriptionFormApi = {
  fetchConfig,
  searchPatient,
  searchSupervisor,
  createPrescription,
  updatePrescription,
  downloadDocuments,
  prescriptionShare,
};
