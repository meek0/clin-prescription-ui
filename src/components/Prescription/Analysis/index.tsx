/* eslint-disable no-console */
import { useDispatch } from 'react-redux';
import { Form } from 'antd';
import { isUndefined } from 'lodash';

import { usePrescriptionForm } from 'store/prescription';
import { prescriptionFormActions } from 'store/prescription/slice';

import { STEPS_ID } from './AnalysisForm/ReusableSteps/constant';
import { StepsMapping } from './stepMapping';

const PrescriptionAnalysis = () => {
  const dispatch = useDispatch();
  const { currentStep, lastStepIsNext } = usePrescriptionForm();

  return (
    <Form.Provider
      onFormFinish={(formName, info) => {
        if (formName !== STEPS_ID.SUBMISSION) {
          dispatch(prescriptionFormActions.saveStepData(info.values));

          if (lastStepIsNext) {
            dispatch(prescriptionFormActions.goToLastStep());
          } else if (!isUndefined(currentStep?.nextStepIndex)) {
            dispatch(prescriptionFormActions.nextStep());
          }
        }
      }}
    >
      {StepsMapping[currentStep?.id!]}
    </Form.Provider>
  );
};

export default PrescriptionAnalysis;
