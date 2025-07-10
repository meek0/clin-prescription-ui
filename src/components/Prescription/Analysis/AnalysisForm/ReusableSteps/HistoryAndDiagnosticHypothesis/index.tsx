/* eslint-disable */
import { Form } from 'antd';

import AnalysisForm from 'components/Prescription/Analysis/AnalysisForm';
import HistoryAndDiagnosticData from 'components/Prescription/components/HistoryAndDiagnosisData';
import { IAnalysisStepForm } from 'components/Prescription/utils/type';
import { usePrescriptionForm } from 'store/prescription';

import { STEPS_ID } from '../constant';

const HistoryAndDiagnosticHypothesis = ({}: IAnalysisStepForm) => {
  const FORM_NAME = STEPS_ID.HISTORY_AND_DIAGNOSIS;
  const [form] = Form.useForm();
  const { analysisFormData } = usePrescriptionForm();

  const getInitialData = () => (analysisFormData ? analysisFormData[FORM_NAME] : undefined);

  return (
    <AnalysisForm layout="horizontal" form={form} name={FORM_NAME}>
      <HistoryAndDiagnosticData parentKey={FORM_NAME} form={form} initialData={getInitialData()} />
    </AnalysisForm>
  );
};

export default HistoryAndDiagnosticHypothesis;
