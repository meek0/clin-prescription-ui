import { TColumnStates } from '@ferlab/ui/core/components/ProTable/types';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { FhirApi } from 'api/fhir';
import { PractitionerRole } from 'api/fhir/models';
import { UsersApi } from 'api/user';
import { TUserConfig } from 'api/user/models';
import keycloak from 'auth/keycloak';
import { DecodedIdToken } from 'auth/types';
import { cloneDeep, get, keys, merge, set } from 'lodash';

import { RootState } from 'store/types';

const fetchPractitionerRole = createAsyncThunk<PractitionerRole[]>(
  'user/searchPractitionerRole',
  async () => {
    const { data } = await FhirApi.searchPractitionerRole();

    return data ? (data.entry ?? []).map((entry) => entry.resource!) : [];
  },
);

const fetchConfig = createAsyncThunk<TUserConfig>('user/fetchConfig', async () => {
  const fetch = await UsersApi.fetch();
  if (fetch.response.status === 404) {
    const decodedIdToken = keycloak.idTokenParsed as DecodedIdToken;
    const create = await UsersApi.create({
      keycloak_id: decodedIdToken.sub,
      email: decodedIdToken.email,
      first_name: decodedIdToken.given_name,
      last_name: decodedIdToken.family_name,
      completed_registration: true,
      config: {},
    });
    return cleanupConfig(create.data?.config || {});
  } else {
    return cleanupConfig(fetch.data?.config || {});
  }
});

const cleanupConfig = (config: TUserConfig): TUserConfig => {
  // keep last item
  const removeDuplicates = (cols: TColumnStates) =>
    cols.filter((c, i) => !cols.some((other, j) => c.key === other.key && j > i));

  // for every tables in config replace columns with no duplicates
  keys(config.data_exploration?.tables).forEach((key) => {
    const path = 'data_exploration.tables.' + key + '.columns';
    const cols = get(config, path, []);
    set(config, path, removeDuplicates(cols));
  });

  return config;
};

const updateConfig = createAsyncThunk<TUserConfig, TUserConfig, { state: RootState }>(
  'user/updateConfig',
  async (config, thunkAPI) => {
    const state = thunkAPI.getState();
    const mergedConfig = cleanupConfig(merge(cloneDeep(state.user.user.config), cloneDeep(config)));
    await UsersApi.update({ config: mergedConfig });

    return mergedConfig;
  },
  {
    condition: (config) => Object.keys(config).length > 0,
  },
);

export { fetchPractitionerRole, fetchConfig, updateConfig, cleanupConfig };
