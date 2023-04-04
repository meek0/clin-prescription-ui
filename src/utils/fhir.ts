import { AnalysisCodeMapping } from 'store/global/types';

import { SERVICE_REQUEST_CODE_MAP_KEY } from './constants';

export const getAnalysisNameMapping = () =>
  JSON.parse(localStorage.getItem(SERVICE_REQUEST_CODE_MAP_KEY) ?? '{}') as AnalysisCodeMapping;

export const getAnalysisNameByCodeFromLocal = (
  code: string,
  defaultValue: string,
  withCode = false,
) => {
  const map = getAnalysisNameMapping();

  if (code in map) {
    return map[code][withCode ? 'displayNameWithCode' : 'displayName'];
  }

  return defaultValue || code;
};
