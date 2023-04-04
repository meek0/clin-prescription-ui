import { sendRequestWithRpt } from 'api';

import EnvironmentVariables from 'utils/EnvVariables';

import { IHpoPayload } from './models';

const HPO_SERVICE_URL = EnvironmentVariables.configFor('ARRANGER_API');

const searchHpos = (term: string) =>
  sendRequestWithRpt<IHpoPayload>({
    method: 'GET',
    url: `${HPO_SERVICE_URL}/hpo/autocomplete`,
    params: {
      prefix: term,
    },
  });

const searchHpoChildren = (hpoCode: string) =>
  sendRequestWithRpt<IHpoPayload>({
    method: 'GET',
    url: `${HPO_SERVICE_URL}/hpo/descendants`,
    params: {
      parentHpoId: hpoCode,
    },
  });

const searchHPOByAncestorId = (hpoId: string, size = 1000, after?: string) =>
  sendRequestWithRpt<IHpoPayload>({
    method: 'GET',
    url: `${HPO_SERVICE_URL}/hpo/ancestors`,
    params: {
      hpoId,
      after,
      size,
    },
  });

export const HpoApi = {
  searchHpos,
  searchHPOByAncestorId,
  searchHpoChildren,
};
