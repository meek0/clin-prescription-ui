import intl from 'react-intl-universal';
import Empty from '@ferlab/ui/core/components/Empty';
import { Table, TableColumnType } from 'antd';
import { HybridPatientPresent } from 'api/hybrid/models';

import { EMPTY_FIELD } from 'components/Prescription/Analysis/AnalysisForm/ReusableSteps/constant';
import { TABLE_EMPTY_PLACE_HOLDER } from 'utils/constants';
import { formatDate } from 'utils/date';

import StatusTag from '../components/StatusTag';
import { getPrescriptionStatusDictionnary } from '../utils/constant';

interface OwnProps {
  patient: HybridPatientPresent;
  analysisType?: string;
  loading?: boolean;
}

const getRequestColumns = (): TableColumnType<Record<string, any>>[] => [
  {
    key: 'sequencing_id',
    dataIndex: 'sequencing_id',
    title: intl.get('screen.prescription.entity.request.id'),
    render: (sequencing_id) => sequencing_id,
  },
  {
    key: 'code',
    dataIndex: 'code',
    title: intl.get('screen.prescription.entity.request.type'),
    width: 400,
    render: (code: string) => {
      if (code) {
        return `${code} - ${intl.get(`screen.prescription.entity.request.code.${code}`)}`;
      }
      return TABLE_EMPTY_PLACE_HOLDER;
    },
  },
  {
    key: 'status',
    dataIndex: 'status',
    title: intl.get('screen.prescription.entity.request.status'),
    render: (value: string) =>
      value ? (
        <StatusTag dictionary={getPrescriptionStatusDictionnary()} status={value?.toLowerCase()} />
      ) : null,
  },
  {
    key: 'authored_on',
    dataIndex: 'authored_on',
    title: intl.get('screen.prescription.entity.request.createdOn'),
    render: (authoredOn) => formatDate(authoredOn),
  },
  {
    key: 'requester',
    dataIndex: 'requester',
    title: intl.get('screen.prescription.entity.request.requester'),
    render: (requester) => requester || EMPTY_FIELD,
  },
  {
    key: 'sample_id',
    dataIndex: 'sample',
    title: intl.get('screen.prescription.entity.request.sampleid'),
    render: (sample) => sample || TABLE_EMPTY_PLACE_HOLDER,
  },
];

const RequestTable = ({ loading = false, patient, analysisType }: OwnProps) => (
  <Table
    loading={loading}
    size="small"
    columns={getRequestColumns()}
    dataSource={patient?.sequencings?.map((sequencing, index) => ({
      ...sequencing,
      analysisType,
      key: index,
    }))}
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
