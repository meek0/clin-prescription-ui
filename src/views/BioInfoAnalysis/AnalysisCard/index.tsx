import intl from 'react-intl-universal';
import { Card, Descriptions } from 'antd';
import {
  extractOrganizationId,
  extractPatientId,
  extractServiceRequestId,
  extractTaskId,
} from 'api/fhir/helper';
import { AnalysisTaskEntity } from 'api/fhir/models';

import ParagraphLoader from 'components/uiKit/ParagraphLoader';
import { formatDate } from 'utils/date';

interface OwnProps {
  analysis?: AnalysisTaskEntity;
  loading: boolean;
}

const AnalysisCard = ({ analysis, loading }: OwnProps) => (
  <Card title={intl.get('screen.bioinfo.analysis.analysis.title')}>
    <ParagraphLoader loading={loading} paragraph={{ rows: 7 }}>
      {analysis && (
        <Descriptions column={1} size="small" className="label-35">
          <Descriptions.Item label={intl.get('screen.bioinfo.analysis.analysis.id')}>
            {extractTaskId(analysis.id)}
          </Descriptions.Item>
          <Descriptions.Item label={intl.get('screen.bioinfo.analysis.analysis.type')}>
            {analysis.code.code}
          </Descriptions.Item>
          <Descriptions.Item label={intl.get('screen.bioinfo.analysis.analysis.date')}>
            {formatDate(analysis.authoredOn)}
          </Descriptions.Item>
          <Descriptions.Item label={intl.get('screen.bioinfo.analysis.analysis.request')}>
            {extractServiceRequestId(analysis.serviceRequestReference)}
          </Descriptions.Item>
          <Descriptions.Item label={intl.get('screen.bioinfo.analysis.analysis.patient')}>
            {extractPatientId(analysis.patientReference)}
          </Descriptions.Item>
          <Descriptions.Item label={intl.get('screen.bioinfo.analysis.analysis.requester')}>
            {extractOrganizationId(analysis.requester.id)}
          </Descriptions.Item>
          <Descriptions.Item label={intl.get('screen.bioinfo.analysis.analysis.owner')}>
            {extractOrganizationId(analysis.ownerReference)}
          </Descriptions.Item>
        </Descriptions>
      )}
    </ParagraphLoader>
  </Card>
);

export default AnalysisCard;
