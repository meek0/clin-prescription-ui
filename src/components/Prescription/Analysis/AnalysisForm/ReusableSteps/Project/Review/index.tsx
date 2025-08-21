import intl from 'react-intl-universal';
import { Descriptions } from 'antd';

import { STEPS_ID } from 'components/Prescription/Analysis/AnalysisForm/ReusableSteps/constant';
import EmptySection from 'components/Prescription/components/EmptySection';
import { IProjectDataType } from 'components/Prescription/components/Project/types';
import { usePrescriptionForm } from 'store/prescription';

const ProjectReview = () => {
  const { analysisFormData } = usePrescriptionForm();
  const getData = (key: keyof IProjectDataType) => analysisFormData[STEPS_ID.PROJECT]?.[key];

  return getData('project' satisfies keyof IProjectDataType) ? (
    <Descriptions className="label-20" column={1} size="small">
      <Descriptions.Item label={intl.get('prescription.project.select.label')}>
        {getData('project' satisfies keyof IProjectDataType)}
      </Descriptions.Item>
    </Descriptions>
  ) : (
    <EmptySection />
  );
};

export default ProjectReview;
