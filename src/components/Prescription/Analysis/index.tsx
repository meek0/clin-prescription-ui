/* eslint-disable no-console */
import { useDispatch } from 'react-redux';
import { Form } from 'antd';

import { useAppDispatch } from 'store';
import { usePrescriptionForm } from 'store/prescription';
import { prescriptionFormActions } from 'store/prescription/slice';
import { createPrescription } from 'store/prescription/thunk';

import { StepsMapping } from './stepMapping';

const PrescriptionAnalysis = () => {
  const dispatch = useDispatch();
  const appDispatch = useAppDispatch();
  const { currentStep, isDraft } = usePrescriptionForm();

  return (
    <Form.Provider
      onFormFinish={async (formName, info) => {
        try {
          dispatch(prescriptionFormActions.saveStepData(info.values));
          const response = await appDispatch(createPrescription()).unwrap();
          dispatch(
            prescriptionFormActions.saveCreatedPrescription({
              prescriptionId: response.prescriptionId,
              isDraft,
              patients: response.patients,
            }),
          );
        } catch (error) {
          console.error('Error while saving prescription', error);
        }
      }}
    >
      {StepsMapping[currentStep?.id!]}
    </Form.Provider>
  );
};

export default PrescriptionAnalysis;
