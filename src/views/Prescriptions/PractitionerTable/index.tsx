import React, { useEffect, useState } from 'react';
import intl from 'react-intl-universal';
import { tieBreaker } from '@ferlab/ui/core/components/ProTable/utils';
import { ISyntheticSqon } from '@ferlab/ui/core/data/sqon/types';
import { SortDirection } from '@ferlab/ui/core/graphql/constants';
import GridCard from '@ferlab/ui/core/view/v2/GridCard';
import { Row, Space, Typography } from 'antd';
import { usePractitionnerPrescriptions } from 'graphql/prescriptions/actions';
import { GraphqlBackend } from 'providers';
import ApolloProvider from 'providers/ApolloProvider';
import PrescriptionsTable from 'views/Prescriptions/PractitionerTable/components/table/PrescriptionTable';
import {
  DEFAULT_OFFSET,
  DEFAULT_PAGE_INDEX,
  DEFAULT_PAGE_SIZE,
  DEFAULT_QUERY_CONFIG,
  DEFAULT_SORT_QUERY,
} from 'views/Prescriptions/PractitionerTable/utils/contstant';

import { useUser } from 'store/user';

import styles from './index.module.css';
import homeStyles from 'views/Home/index.module.css';

const { Title } = Typography;
const PractitionerTable = (): React.ReactElement => {
  const [prescriptionPageIndex, setPrescriptionPageIndex] = useState(DEFAULT_PAGE_INDEX);
  const [prescriptionQueryConfig, setPrescriptionQueryConfig] = useState({
    ...DEFAULT_QUERY_CONFIG,
    size: DEFAULT_PAGE_SIZE,
  });
  const { user } = useUser();

  const prescriptionsQueryVariables = {
    first: prescriptionQueryConfig.size,
    offset: DEFAULT_OFFSET,
    searchAfter: prescriptionQueryConfig.searchAfter,
    sqon: {
      content: [
        {
          op: 'in',
          content: { field: 'requester', value: user.practitionerRoles.map((pr) => pr.id) },
        },
      ],
      op: 'and',
    } as ISyntheticSqon,
    sort: tieBreaker({
      sort: prescriptionQueryConfig.sort,
      defaultSort: DEFAULT_SORT_QUERY,
      field: '_id',
      order: prescriptionQueryConfig.operations?.previous ? SortDirection.Asc : SortDirection.Desc,
    }),
  };

  const prescriptions = usePractitionnerPrescriptions(
    prescriptionsQueryVariables,
    prescriptionQueryConfig.operations,
  );

  useEffect(() => {
    if (
      prescriptionQueryConfig.firstPageFlag !== undefined ||
      prescriptionQueryConfig.searchAfter === undefined
    ) {
      return;
    }

    setPrescriptionQueryConfig({
      ...prescriptionQueryConfig,
      firstPageFlag: prescriptionQueryConfig.searchAfter,
    });
  }, [prescriptionQueryConfig]);

  if (!prescriptions || prescriptions.total === 0) {
    return <></>;
  }

  return (
    <GridCard
      title={<Title level={3}>{intl.get('my.prescriptions')}</Title>}
      bordered={false}
      className={homeStyles.contentCard}
      wrapperClassName={homeStyles.contentCardWrapper}
      content={
        <Row gutter={[48, 48]}>
          <Space direction="vertical" size="middle" className={styles.patientContentContainer}>
            <PrescriptionsTable
              results={prescriptions}
              queryConfig={prescriptionQueryConfig}
              setQueryConfig={setPrescriptionQueryConfig}
              loading={prescriptions.loading}
              pageIndex={prescriptionPageIndex}
              setPageIndex={setPrescriptionPageIndex}
            />
          </Space>
        </Row>
      }
    />
  );
};

const PatientSearchWrapper = () => (
  <ApolloProvider backend={GraphqlBackend.ARRANGER}>
    <PractitionerTable />
  </ApolloProvider>
);

export default PatientSearchWrapper;
