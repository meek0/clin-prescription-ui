import { sendRequest } from 'api';

import { MIME_TYPES } from 'utils/constants';
import EnvironmentVariables from 'utils/EnvVariables';

const PANELS_FILE = EnvironmentVariables.configFor('PANELS_FILE');

const fetchPanelsFile = () =>
  sendRequest({
    url: PANELS_FILE + `?timestamp=${Date.now()}`, // timestamp to ignore cache
    headers: {
      'Content-Type': MIME_TYPES.APPLICATION_XLSX,
    },
    responseType: 'blob',
    method: 'GET',
  });

export const PanelsApi = {
  fetchPanelsFile,
};
