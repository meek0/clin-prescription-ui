import { Spin } from 'antd';
import { ExtendedMappingResults } from 'graphql/models';

import FilterList, { TCustomFilterMapper } from 'components/uiKit/FilterList';
import { FilterInfo } from 'components/uiKit/FilterList/types';

export const filtersContainer = (
  mappingResults: ExtendedMappingResults,
  index: string,
  qbId: string,
  filterInfo: FilterInfo,
  filterMapper?: TCustomFilterMapper,
): React.ReactNode => {
  if (mappingResults.loading) {
    return <Spin style={{ padding: '24px', width: '100%' }} spinning />;
  }

  return (
    <FilterList
      key={`${index}-${qbId}-filters`}
      index={index}
      queryBuilderId={qbId}
      extendedMappingResults={mappingResults}
      filterInfo={filterInfo}
      filterMapper={filterMapper}
    />
  );
};
