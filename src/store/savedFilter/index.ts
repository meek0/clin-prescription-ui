import { useSelector } from 'react-redux';

import useQueryParams from 'hooks/useQueryParams';
import { FILTER_ID_QUERY_PARAM_KEY } from 'utils/constants';

import { savedFilterSelector } from './selector';

export { default, SavedFilterState } from './slice';
export type { initialState as SavedFilterInitialState } from './types';
export const useSavedFilter = (tag?: string) => {
  const savedFilterState = useSelector(savedFilterSelector);
  const params = useQueryParams();

  if (tag) {
    const filters = savedFilterState.savedFilters.filter((savedFilter) => savedFilter.tag === tag);
    const selectedFilterById = filters.find(
      ({ id }) => id === params.get(FILTER_ID_QUERY_PARAM_KEY),
    );

    return {
      ...savedFilterState,
      defaultFilter: selectedFilterById,
      savedFilters: filters,
    };
  }

  return savedFilterState;
};
