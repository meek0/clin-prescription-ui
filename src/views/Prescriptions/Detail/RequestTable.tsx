import intl from 'react-intl-universal';
import Empty from '@ferlab/ui/core/components/Empty';
import { Table, TableColumnType } from 'antd';
import { extractServiceRequestId } from 'api/fhir/helper';
import { PatientRequest } from 'api/fhir/models';

import { EMPTY_FIELD } from 'components/Prescription/Analysis/AnalysisForm/ReusableSteps/constant';
import { TABLE_EMPTY_PLACE_HOLDER } from 'utils/constants';
import { formatDate } from 'utils/date';

import StatusTag from '../components/StatusTag';
import { getPrescriptionStatusDictionnary } from '../utils/constant';

interface OwnProps {
  patientId: string;
  data: PatientRequest[];
  loading?: boolean;
}

const getRequestColumns = (): TableColumnType<Record<string, any>>[] => [
  {
    key: 'id',
    dataIndex: 'id',
    title: intl.get('screen.prescription.entity.request.id'),
    render: (id) => extractServiceRequestId(id),
  },
  {
    key: 'coding',
    dataIndex: 'coding',
    title: intl.get('screen.prescription.entity.request.code'),
    render: (coding: { code: string; system: string }[]) => {
      const sequencingCode = coding?.find((c) => c.system?.includes('sequencing'));
      return sequencingCode?.code ? sequencingCode.code : TABLE_EMPTY_PLACE_HOLDER;
    },
  },
  {
    key: 'status',
    dataIndex: 'status',
    title: intl.get('screen.prescription.entity.request.status'),
    render: (value: string) =>
      value ? <StatusTag dictionary={getPrescriptionStatusDictionnary()} status={value} /> : null,
  },
  {
    key: 'created',
    dataIndex: 'authoredOn',
    title: intl.get('screen.prescription.entity.request.createdOn'),
    render: (authoredOn) => formatDate(authoredOn),
  },
  {
    key: 'requester',
    dataIndex: 'requester',
    title: intl.get('screen.prescription.entity.request.requester'),
    render: (requester) =>
      requester
        ? `${requester.practitioner?.name.family.toLocaleUpperCase()}
      ${requester.practitioner?.name?.given?.join(' ')}`
        : EMPTY_FIELD,
  },
  {
    key: 'specimen_id',
    title: intl.get('screen.prescription.entity.request.sampleid'),
    render: (data: PatientRequest) => {
      // specimen with parent is the sample
      const specimen = data.specimen?.find((specimen) => 'parent' in specimen.resource);
      return specimen ? specimen?.resource.accessionIdentifier.value : TABLE_EMPTY_PLACE_HOLDER;
    },
  },
];

const RequestTable = ({ loading = false, data = [] }: OwnProps) => (
  <Table
    loading={loading}
    size="small"
    columns={getRequestColumns()}
    dataSource={data.map((data, index) => ({ ...data, key: index }))}
    bordered
    locale={{
      emptyText: <Empty description="Aucune requête" />,
    }}
    pagination={{
      hideOnSinglePage: true,
    }}
  />
);

export default RequestTable;
