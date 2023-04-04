import intl from 'react-intl-universal';
import { Card, Descriptions } from 'antd';
import { AnalysisTaskWorkflow } from 'api/fhir/models';

import ParagraphLoader from 'components/uiKit/ParagraphLoader';

interface OwnProps {
  workflow?: AnalysisTaskWorkflow;
  loading: boolean;
}

const BioInfoPipelineCard = ({ workflow, loading }: OwnProps) => (
  <Card title={intl.get('screen.bioinfo.analysis.bioInfoPipeline.title')}>
    <ParagraphLoader loading={loading} paragraph={{ rows: 3 }}>
      {workflow && (
        <Descriptions column={1} size="small" className="label-35">
          <Descriptions.Item label={intl.get('screen.bioinfo.analysis.bioInfoPipeline.name')}>
            {workflow.name}
          </Descriptions.Item>
          <Descriptions.Item label={intl.get('screen.bioinfo.analysis.bioInfoPipeline.version')}>
            {workflow.version}
          </Descriptions.Item>
          <Descriptions.Item label={intl.get('screen.bioinfo.analysis.bioInfoPipeline.genome')}>
            {workflow.genomeBuild}
          </Descriptions.Item>
        </Descriptions>
      )}
    </ParagraphLoader>
  </Card>
);

export default BioInfoPipelineCard;
