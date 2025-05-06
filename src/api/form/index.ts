import { sendRequestWithRpt } from 'api';

import { LANG } from 'utils/constants';
import EnvironmentVariables from 'utils/EnvVariables';

import { TFormConfig } from './models';

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
  downloadDocuments,
  prescriptionShare,
};
