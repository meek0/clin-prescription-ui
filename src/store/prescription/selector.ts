import { initialState } from 'store/prescription/types';
import { RootState } from 'store/types';

export type TPrescriptionProps = initialState;

export const prescriptionSelector = (state: RootState) => state.prescription;
