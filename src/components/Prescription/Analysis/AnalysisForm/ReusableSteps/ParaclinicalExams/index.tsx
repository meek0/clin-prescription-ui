/* eslint-disable */
import { Form } from 'antd';

import AnalysisForm from 'components/Prescription/Analysis/AnalysisForm';
import ParaclinicalExamsSelect from 'components/Prescription/components/ParaclinicalExamsSelect';
import { IAnalysisStepForm } from 'components/Prescription/utils/type';
import { usePrescriptionForm } from 'store/prescription';

import { STEPS_ID } from '../constant';

const ParaclinicalExams = ({}: IAnalysisStepForm) => {
  const FORM_NAME = STEPS_ID.PROBAND_PARACLINICAL;
  const [form] = Form.useForm();
  const { analysisFormData } = usePrescriptionForm();

  const getInitialData = () => (analysisFormData ? analysisFormData[FORM_NAME] : undefined);

  return (
    <AnalysisForm layout="horizontal" form={form} name={FORM_NAME}>
      <ParaclinicalExamsSelect form={form} parentKey={FORM_NAME} initialData={getInitialData()} />
    </AnalysisForm>
  );
};

export default ParaclinicalExams;
