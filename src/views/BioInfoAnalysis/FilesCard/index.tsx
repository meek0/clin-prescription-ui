import intl from 'react-intl-universal';
import Empty from '@ferlab/ui/core/components/Empty';
import { Table, TableColumnType, Typography } from 'antd';
import { FhirDoc } from 'graphql/patients/models/Patient';
import { isEmpty } from 'lodash';

import CollapsePanel from 'components/containers/collapse';
import { formatFileSize } from 'utils/formatFileSize';

const { Title } = Typography;

interface OwnProps {
  files?: FhirDoc[];
  loading: boolean;
}

const getFilesColumns = (): TableColumnType<any>[] => [
  {
    title: intl.get('screen.bioinfo.analysis.files.name'),
    render: (doc: FhirDoc) => doc.content[0].attachment.title,
  },
  {
    title: intl.get('screen.bioinfo.analysis.files.type'),
    render: (doc: FhirDoc) => doc.type,
  },
  {
    title: intl.get('screen.bioinfo.analysis.files.format'),
    render: (doc: FhirDoc) => doc.content[0].format,
  },
  {
    title: intl.get('screen.bioinfo.analysis.files.sampleldm'),
    render: (doc: FhirDoc) => doc.sample.value,
  },
  {
    title: intl.get('screen.bioinfo.analysis.files.size'),
    render: (doc: FhirDoc) => formatFileSize(doc.content[0].attachment.size),
  },
  {
    title: intl.get('screen.bioinfo.analysis.files.url'),
    render: (doc: FhirDoc) => doc.content[0].attachment.url,
    width: 100,
  },
  {
    title: intl.get('screen.bioinfo.analysis.files.hash'),
    render: (doc: FhirDoc) => doc.content[0].attachment.hash,
    width: 100,
  },
];

const FilesCard = ({ files, loading }: OwnProps) => (
  <CollapsePanel
    header={<Title level={4}>{intl.get('screen.bioinfo.analysis.files.title')}</Title>}
    loading={loading}
  >
    {isEmpty(files) ? (
      <></>
    ) : (
      <Table
        loading={loading}
        size="small"
        columns={getFilesColumns()}
        dataSource={files?.map((file, index) => ({ key: index, ...file }))}
        bordered
        locale={{
          emptyText: <Empty description={intl.get('screen.bioinfo.analysis.files.noData')} />,
        }}
        pagination={{
          hideOnSinglePage: true,
        }}
      />
    )}
  </CollapsePanel>
);

export default FilesCard;
