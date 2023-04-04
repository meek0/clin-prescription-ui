import intl from 'react-intl-universal';
import { Card, Descriptions } from 'antd';
import { AnalysisTaskExperiment } from 'api/fhir/models';

import ParagraphLoader from 'components/uiKit/ParagraphLoader';
import { formatDate } from 'utils/date';

interface OwnProps {
  experiment?: AnalysisTaskExperiment;
  loading: boolean;
}

const ExperimentCard = ({ experiment, loading }: OwnProps) => (
  <Card title={intl.get('screen.bioinfo.analysis.experiment.title')}>
    <ParagraphLoader loading={loading} paragraph={{ rows: 8 }}>
      {experiment && (
        <Descriptions column={1} size="small" className="label-35">
          <Descriptions.Item
            label={intl.get('screen.bioinfo.analysis.experiment.experimental.stategy')}
          >
            {experiment.experimentalStrategy}
          </Descriptions.Item>
          <Descriptions.Item label={intl.get('screen.bioinfo.analysis.experiment.runName')}>
            {experiment.name}
          </Descriptions.Item>
          <Descriptions.Item label={intl.get('screen.bioinfo.analysis.experiment.runAlias')}>
            {experiment.alias}
          </Descriptions.Item>
          <Descriptions.Item label={intl.get('screen.bioinfo.analysis.experiment.platform')}>
            {experiment.platform}
          </Descriptions.Item>
          <Descriptions.Item label={intl.get('screen.bioinfo.analysis.experiment.captureKit')}>
            {experiment.captureKit}
          </Descriptions.Item>
          <Descriptions.Item label={intl.get('screen.bioinfo.analysis.experiment.sequencer')}>
            {experiment.sequencerId}
          </Descriptions.Item>
          <Descriptions.Item label={intl.get('screen.bioinfo.analysis.experiment.date')}>
            {formatDate(experiment.runDate)}
          </Descriptions.Item>
          <Descriptions.Item label={intl.get('screen.bioinfo.analysis.experiment.aliquot')}>
            {experiment.aliquotId}
          </Descriptions.Item>
        </Descriptions>
      )}
    </ParagraphLoader>
  </Card>
);

export default ExperimentCard;
