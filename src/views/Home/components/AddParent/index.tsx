import React from 'react';
import intl from 'react-intl-universal';
import { useDispatch } from 'react-redux';
import { tieBreaker } from '@ferlab/ui/core/components/ProTable/utils';
import { ISyntheticSqon } from '@ferlab/ui/core/data/sqon/types';
import { SortDirection } from '@ferlab/ui/core/graphql/constants';
import { Col } from 'antd';
import { usePractitionnerPrescriptions } from 'graphql/prescriptions/actions';
import { GraphqlBackend } from 'providers';
import ApolloProvider from 'providers/ApolloProvider';
import {
  DEFAULT_OFFSET,
  DEFAULT_PAGE_SIZE,
  DEFAULT_QUERY_CONFIG,
  DEFAULT_SORT_QUERY,
} from 'views/Prescriptions/PractitionerTable/utils/contstant';

import FamilyRestroomIcon from 'components/icons/FamilyRestroomIcon';
import { prescriptionFormActions } from 'store/prescription/slice';
import { useUser } from 'store/user';

import ActionButton from '../ActionButton';

const AddParentButton = (): React.ReactElement => {
  const dispatch = useDispatch();
  const { user } = useUser();

  const prescriptionsQueryVariables = {
    first: DEFAULT_PAGE_SIZE,
    offset: DEFAULT_OFFSET,
    searchAfter: DEFAULT_QUERY_CONFIG.searchAfter,
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
      sort: DEFAULT_QUERY_CONFIG.sort,
      defaultSort: DEFAULT_SORT_QUERY,
      field: '_id',
      order: DEFAULT_QUERY_CONFIG.operations?.previous ? SortDirection.Asc : SortDirection.Desc,
    }),
  };

  const prescriptions = usePractitionnerPrescriptions(
    prescriptionsQueryVariables,
    DEFAULT_QUERY_CONFIG.operations,
  );

  if (!prescriptions || prescriptions.total === 0) {
    return <></>;
  }

  return (
    <Col lg={12} flex="auto">
      <ActionButton
        disabled
        icon={<FamilyRestroomIcon />}
        title={intl.get('add.parent.to.existing.prescription')}
        description={intl.get('find.analysis.and.add.family.member')}
        onClick={() => dispatch(prescriptionFormActions.startAddParentChoice())}
      />
    </Col>
  );
};

const AddParentButtonWrapper = () => (
  <ApolloProvider backend={GraphqlBackend.ARRANGER}>
    <AddParentButton />
  </ApolloProvider>
);

export default AddParentButtonWrapper;
