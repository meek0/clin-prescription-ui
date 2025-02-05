import React from 'react';
import { useDispatch } from 'react-redux';
import ProTable from '@ferlab/ui/core/components/ProTable';
import { PaginationViewPerQuery } from '@ferlab/ui/core/components/ProTable/Pagination/constants';
import { IQueryConfig, TQueryConfigCb } from '@ferlab/ui/core/graphql/types';
import { GqlResults } from 'graphql/models';
import { AnalysisResult, ITableAnalysisResult } from 'graphql/prescriptions/models/Prescription';
import {
  DEFAULT_PAGE_INDEX,
  PRESCRIPTION_SCROLL_ID,
} from 'views/Prescriptions/PractitionerTable/utils/contstant';

import { useUser } from 'store/user';
import { updateConfig } from 'store/user/thunks';
import { formatQuerySortList, scrollToTop } from 'utils/helper';
import { getProTableDictionary } from 'utils/translation';

import { prescriptionsColumns } from './columns';

import styles from './index.module.css';

interface OwnProps {
  results: GqlResults<AnalysisResult>;
  total?: number;
  extra?: React.ReactElement;
  loading?: boolean;
  setQueryConfig: TQueryConfigCb;
  queryConfig: IQueryConfig;
  pageIndex: number;
  setPageIndex: (value: number) => void;
  loadingPractitioner: boolean;
  practitionerInfoList: any[];
}

const PrescriptionsTable = ({
  results,
  setQueryConfig,
  queryConfig,
  pageIndex,
  setPageIndex,
  loadingPractitioner,
  practitionerInfoList,
  loading = false,
}: OwnProps): React.ReactElement => {
  const dispatch = useDispatch();
  const { user } = useUser();
  const initialColumns = user.config.data_exploration?.tables?.prescriptionsAnalyse?.columns;

  return (
    <ProTable<ITableAnalysisResult>
      tableId="prescription_table"
      columns={prescriptionsColumns(practitionerInfoList)}
      initialColumnState={initialColumns}
      dataSource={results?.data.map((i) => ({ ...i, key: i.id }))}
      className={styles.prescriptionTableWrapper}
      loading={loading && loadingPractitioner}
      dictionary={getProTableDictionary()}
      showSorterTooltip={false}
      bordered
      // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
      onChange={({ current }, _, sorter) => {
        setPageIndex(DEFAULT_PAGE_INDEX);
        setQueryConfig({
          pageIndex: DEFAULT_PAGE_INDEX,
          size: queryConfig.size!,
          // @ts-ignore
          sort: formatQuerySortList(sorter),
        });
        scrollToTop(PRESCRIPTION_SCROLL_ID);
      }}
      enableRowSelection={false}
      headerConfig={{
        itemCount: {
          pageIndex: pageIndex,
          pageSize: queryConfig.size,
          total: results?.total || 0,
        },
        hideItemsCount: true,
        enableColumnSort: true,
        enableTableExport: false,
        onColumnSortChange: (columns) => {
          dispatch(
            updateConfig({
              data_exploration: {
                tables: {
                  prescriptionsAnalyse: { columns },
                },
              },
            }),
          );
        },
      }}
      size="small"
      pagination={{
        current: pageIndex,
        queryConfig,
        setQueryConfig,
        onChange: (page: number) => {
          scrollToTop(PRESCRIPTION_SCROLL_ID);
          setPageIndex(page);
        },
        onViewQueryChange: (viewPerQuery: PaginationViewPerQuery) => {
          dispatch(
            updateConfig({
              data_exploration: {
                tables: {
                  prescriptions: {
                    ...user?.config.data_exploration?.tables?.prescriptionsAnalyse,
                    viewPerQuery,
                  },
                },
              },
            }),
          );
        },
        searchAfter: results?.searchAfter,
        defaultViewPerQuery: queryConfig.size,
      }}
    />
  );
};

export default PrescriptionsTable;
