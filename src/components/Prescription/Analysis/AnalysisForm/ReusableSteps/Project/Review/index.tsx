import intl from 'react-intl-universal';
import { Descriptions } from 'antd';
import { isEmpty } from 'lodash';

import {
  EMPTY_FIELD,
  STEPS_ID,
} from 'components/Prescription/Analysis/AnalysisForm/ReusableSteps/constant';
import EmptySection from 'components/Prescription/components/EmptySection';
import { IProjectDataType } from 'components/Prescription/components/Project/types';
import { usePrescriptionForm } from 'store/prescription';

const ProjectReview = () => {
  const { analysisFormData } = usePrescriptionForm();
  const getData = (key: keyof IProjectDataType) => analysisFormData[STEPS_ID.PROJECT]?.[key];

  const getResearchProject = () => {
    const project = getData('project' satisfies keyof IProjectDataType);
    return isEmpty(history) ? EMPTY_FIELD : project;
  };

  return getData('project' satisfies keyof IProjectDataType) ? (
    <Descriptions className="label-20" column={1} size="small">
      <Descriptions.Item label={intl.get('prescription.project.select.label')}>
        {getResearchProject()}
      </Descriptions.Item>
    </Descriptions>
  ) : (
    <EmptySection />
  );
};

export default ProjectReview;
