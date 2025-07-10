/* eslint-disable */
import { Form } from 'antd';

import AnalysisForm from 'components/Prescription/Analysis/AnalysisForm';
import ClinicalSignsSelect from 'components/Prescription/components/ClinicalSignsSelect';
import { IAnalysisStepForm } from 'components/Prescription/utils/type';
import { usePrescriptionForm } from 'store/prescription';

import { STEPS_ID } from '../constant';

const ClinicalSigns = ({}: IAnalysisStepForm) => {
  const FORM_NAME = STEPS_ID.PROBAND_CLINICAL;
  const [form] = Form.useForm();
  const { analysisFormData } = usePrescriptionForm();

  return (
    <AnalysisForm layout="horizontal" form={form} name={FORM_NAME}>
      <ClinicalSignsSelect form={form} parentKey={[STEPS_ID.PROBAND_CLINICAL]} initialData={analysisFormData?.proband_clinical} />
    </AnalysisForm>
  );
};

export default ClinicalSigns;
