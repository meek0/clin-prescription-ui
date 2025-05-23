import React, { useEffect, useMemo, useState } from 'react';
import intl from 'react-intl-universal';
import ProLabel from '@ferlab/ui/core/components/ProLabel';
import { tieBreaker } from '@ferlab/ui/core/components/ProTable/utils';
import { BooleanOperators } from '@ferlab/ui/core/data/sqon/operators';
import { ISyntheticSqon, TSyntheticSqonContent } from '@ferlab/ui/core/data/sqon/types';
import { generateQuery, generateValueFilter } from '@ferlab/ui/core/data/sqon/utils';
import { SortDirection } from '@ferlab/ui/core/graphql/constants';
import useDebounce from '@ferlab/ui/core/hooks/useDebounce';
import GridCard from '@ferlab/ui/core/view/v2/GridCard';
import { Input, Row, Typography } from 'antd';
import { FhirApi } from 'api/fhir';
import { PractitionerRole } from 'api/fhir/models';
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

import { commonPrescriptionFilterFields } from '../utils/constant';

import { getPractitionerInfoList } from './utils/export';

import styles from './index.module.css';
import homeStyles from 'views/Home/index.module.css';

const generateSearchFilter = (search: string) =>
  generateQuery({
    operator: BooleanOperators.or,
    newFilters: [
      ...commonPrescriptionFilterFields,
      'person.first_name',
      'person.last_name',
      'person.ramq',
    ].map((key) =>
      generateValueFilter({
        field: key,
        value: [`${search.replaceAll(' ', '').trim()}*`],
      }),
    ),
  });

const { Title } = Typography;
const PractitionerTable = (): React.ReactElement => {
  const [prescriptionPageIndex, setPrescriptionPageIndex] = useState(DEFAULT_PAGE_INDEX);
  const [practitionerInfoList, setPractitionerInfoList] = useState<any[]>([]);
  const [loadindPractitionner, setLoadindPractitionner] = useState<boolean>(true);
  const [prescriptionQueryConfig, setPrescriptionQueryConfig] = useState({
    ...DEFAULT_QUERY_CONFIG,
    size: DEFAULT_PAGE_SIZE,
  });
  const { user } = useUser();
  const [search, setSearch] = useState('');

  const debouncedSearch = useDebounce(search, 350);

  const searchQuery = useMemo(() => generateSearchFilter(debouncedSearch), [debouncedSearch]);

  const sqonContent: TSyntheticSqonContent = [
    {
      op: 'or',
      content: [
        {
          op: 'in',
          content: {
            field: 'security_tags',
            value: user.practitionerRoles.map((pr) => 'PractitionerRole/' + pr.id),
          },
        },
        {
          op: 'in',
          content: { field: 'requester', value: user.practitionerRoles.map((pr) => pr.id) },
        },
      ],
    },
  ];

  if (debouncedSearch) {
    sqonContent.push(searchQuery);
  }

  const prescriptionsQueryVariables = {
    first: prescriptionQueryConfig.size,
    offset: DEFAULT_OFFSET,
    searchAfter: prescriptionQueryConfig.searchAfter,
    sqon: {
      content: sqonContent,
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
    FhirApi.searchPractitionerRoles()
      .then(({ data }) => {
        const practionerList =
          data?.entry?.map((entry) => entry.resource as PractitionerRole) || [];
        if (practionerList) {
          setPractitionerInfoList(getPractitionerInfoList(practionerList));
        }
      })
      .finally(() => {
        setLoadindPractitionner(false);
      });
  }, []);

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

  return (
    <GridCard
      title={<Title level={3}>{intl.get('my.prescriptions')}</Title>}
      bordered={false}
      className={homeStyles.contentCard}
      wrapperClassName={homeStyles.contentCardWrapper}
      content={
        <Row gutter={[48, 48]}>
          <div className={styles.patientContentContainer}>
            <ProLabel title={intl.get('home.prescription.search.box.title')} colon />
            <Input onChange={(t) => setSearch(t.target.value)} />
            <PrescriptionsTable
              results={prescriptions}
              queryConfig={prescriptionQueryConfig}
              setQueryConfig={setPrescriptionQueryConfig}
              loading={prescriptions.loading}
              loadingPractitioner={loadindPractitionner}
              practitionerInfoList={practitionerInfoList}
              pageIndex={prescriptionPageIndex}
              setPageIndex={setPrescriptionPageIndex}
            />
          </div>
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
