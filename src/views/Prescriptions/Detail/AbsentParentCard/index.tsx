import intl from 'react-intl-universal';
import GridCard from '@ferlab/ui/core/view/v2/GridCard';
import { Descriptions, Space, Typography } from 'antd';
import { HybridPatientNotPresent } from 'api/hybrid/models';

import CollapsePanel from 'components/containers/collapse';
import { EnterInfoMomentValue } from 'components/Prescription/Analysis/AnalysisForm/ReusableSteps/ParentIdentification/types';
import ParagraphLoader from 'components/uiKit/ParagraphLoader';

interface OwnProps {
  patient: HybridPatientNotPresent;
  loading: boolean;
}

const { Title } = Typography;

const AbsentParentCard = ({ loading, patient }: OwnProps) => (
  <ParagraphLoader loading={loading} paragraph={{ rows: 6 }}>
    <CollapsePanel
      header={<Title level={4}>{intl.get(patient.family_member)}</Title>}
      datacy={`ParentCard_${intl.get(patient.family_member)}`}
    >
      <Space direction="vertical" size="large">
        <GridCard
          content={
            <Descriptions column={1} size="small" className="label-20">
              <Descriptions.Item
                label={
                  patient.status === EnterInfoMomentValue.NEVER
                    ? intl.get('prescription.parent.identification.review.permanent.absence')
                    : intl.get('prescription.parent.identification.review.temporary.absence')
                }
              >
                {patient.reason}
              </Descriptions.Item>
            </Descriptions>
          }
        />
      </Space>
    </CollapsePanel>
  </ParagraphLoader>
);

export default AbsentParentCard;
