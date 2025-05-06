import intl from 'react-intl-universal';
import GridCard from '@ferlab/ui/core/view/v2/GridCard';
import { Descriptions, Space, Typography } from 'antd';
import { useObservationSocialHistoryEntity } from 'graphql/prescriptions/actions';

import CollapsePanel from 'components/containers/collapse';
import { EnterInfoMomentValue } from 'components/Prescription/Analysis/AnalysisForm/ReusableSteps/ParentIdentification/types';
import ParagraphLoader from 'components/uiKit/ParagraphLoader';

interface OwnProps {
  observationId: string;
  code: string;
  loading: boolean;
}

const { Title } = Typography;

const AbsentParentCard = ({ loading, observationId, code }: OwnProps) => {
  const { socialHistoryValue } = useObservationSocialHistoryEntity(observationId);

  return (
    <ParagraphLoader loading={loading} paragraph={{ rows: 6 }}>
      <CollapsePanel
        header={<Title level={4}>{intl.get(code)}</Title>}
        datacy={`ParentCard_${intl.get(code)}`}
      >
        <Space direction="vertical" size="large">
          <GridCard
            content={
              <Descriptions column={1} size="small" className="label-20">
                <Descriptions.Item
                  label={
                    socialHistoryValue?.valueCodeableConcept?.coding.code.toLowerCase() ===
                    EnterInfoMomentValue.NEVER
                      ? intl.get('prescription.parent.identification.review.permanent.absence')
                      : intl.get('prescription.parent.identification.review.temporary.absence')
                  }
                >
                  {socialHistoryValue?.note?.text}
                </Descriptions.Item>
              </Descriptions>
            }
          />
        </Space>
      </CollapsePanel>
    </ParagraphLoader>
  );
};

export default AbsentParentCard;
