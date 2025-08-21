/* eslint-disable */
import { Form, Typography } from 'antd';

import AnalysisForm from 'components/Prescription/Analysis/AnalysisForm';
import { IAnalysisStepForm } from 'components/Prescription/utils/type';
import { usePrescriptionForm } from 'store/prescription';

import { STEPS_ID } from '../constant';

import ReserchProjectData from 'components/Prescription/components/Project';

const Project = ({}: IAnalysisStepForm) => {
  const FORM_NAME = STEPS_ID.PROJECT;
  const [form] = Form.useForm();
  const { analysisFormData } = usePrescriptionForm();

  const getInitialData = () => (analysisFormData ? analysisFormData[FORM_NAME] : undefined);

  return (
    <AnalysisForm layout="horizontal" form={form} name={FORM_NAME}>
      <ReserchProjectData parentKey={FORM_NAME} form={form} initialData={getInitialData()} />
    </AnalysisForm>
  );
};

export default Project;
