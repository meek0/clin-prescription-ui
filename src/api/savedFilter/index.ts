import { sendRequestWithRpt } from 'api';

import EnvironmentVariables from 'utils/EnvVariables';

import { TUserSavedFilter, TUserSavedFilterInsert, TUserSavedFilterUpdate } from './models';

const SAVED_FILTER_API_URL = `${EnvironmentVariables.configFor('USERS_API_URL')}/saved-filters`;

const headers = () => ({
  'Content-Type': 'application/json',
});

const fetchAll = (tag?: string) =>
  sendRequestWithRpt<TUserSavedFilter[]>({
    method: 'GET',
    url: `${SAVED_FILTER_API_URL}${tag ? '/tag/' + tag : ''}`,
    headers: headers(),
  });

const fetchById = (id: string) =>
  sendRequestWithRpt<TUserSavedFilter>({
    method: 'GET',
    url: `${SAVED_FILTER_API_URL}/${id}`,
    headers: headers(),
  });

const create = (body: TUserSavedFilterInsert) =>
  sendRequestWithRpt<TUserSavedFilter>({
    method: 'POST',
    url: SAVED_FILTER_API_URL,
    headers: headers(),
    data: body,
  });

const update = (id: string, body: TUserSavedFilterUpdate) =>
  sendRequestWithRpt<TUserSavedFilter>({
    method: 'PUT',
    url: `${SAVED_FILTER_API_URL}/${id}`,
    headers: headers(),
    data: body,
  });

const setAsDefault = (id: string, body: TUserSavedFilterUpdate) =>
  sendRequestWithRpt<TUserSavedFilter>({
    method: 'PUT',
    url: `${SAVED_FILTER_API_URL}/${id}/default`,
    headers: headers(),
    data: body,
  });

const destroy = (id: string) =>
  sendRequestWithRpt<string>({
    method: 'DELETE',
    url: `${SAVED_FILTER_API_URL}/${id}`,
    headers: headers(),
  });

export const SavedFilterApi = {
  fetchAll,
  fetchById,
  create,
  update,
  destroy,
  setAsDefault,
};
