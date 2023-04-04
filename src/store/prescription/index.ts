import { useSelector } from 'react-redux';

import { prescriptionSelector } from 'store/prescription/selector';

export type { initialState as PrescriptionInitialState } from './types';
export { default, PrescriptionState } from './slice';
export const usePrescriptionForm = () => useSelector(prescriptionSelector);
export const usePrescriptionFormConfig = () => useSelector(prescriptionSelector).formState.config;
