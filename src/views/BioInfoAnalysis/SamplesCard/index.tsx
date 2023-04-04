import intl from 'react-intl-universal';
import Empty from '@ferlab/ui/core/components/Empty';
import { Table, TableColumnType, Typography } from 'antd';
import { AnalysisTaskSample } from 'api/fhir/models';
import { isEmpty } from 'lodash';

import CollapsePanel from 'components/containers/collapse';

const { Title } = Typography;

interface OwnProps {
  samples?: AnalysisTaskSample[];
  loading: boolean;
}

const getSamplesColumns = (): TableColumnType<any>[] => [
  {
    dataIndex: 'value',
    title: intl.get('screen.bioinfo.analysis.samples.sampleldm'),
  },
  {
    dataIndex: 'code',
    title: intl.get('screen.bioinfo.analysis.samples.type'),
  },
  {
    title: intl.get('screen.bioinfo.analysis.samples.specimenldm'),
    render: (sample: AnalysisTaskSample) => sample.parent[0].resource.value,
  },
  {
    title: intl.get('screen.bioinfo.analysis.samples.specimen.type'),
    render: (sample: AnalysisTaskSample) => sample.parent[0].resource.code,
  },
  {
    dataIndex: 'tissue',
    title: intl.get('screen.bioinfo.analysis.samples.tissue'),
    render: () => '-',
  },
];

const SamplesCard = ({ samples, loading }: OwnProps) => (
  <CollapsePanel
    header={<Title level={4}>{intl.get('screen.bioinfo.analysis.samples.title')}</Title>}
    loading={loading}
  >
    {isEmpty(samples) ? (
      <></>
    ) : (
      <Table
        loading={loading}
        size="small"
        columns={getSamplesColumns()}
        dataSource={samples?.map((sample, index) => ({ key: index, ...sample }))}
        bordered
        locale={{
          emptyText: <Empty description={intl.get('screen.bioinfo.analysis.samples.noData')} />,
        }}
        pagination={{
          hideOnSinglePage: true,
        }}
      />
    )}
  </CollapsePanel>
);

export default SamplesCard;
