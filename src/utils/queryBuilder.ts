import { CNV_VARIANT_PATIENT_QB_ID } from 'views/Cnv/utils/constant';
import { SNV_VARIANT_PATIENT_QB_ID, VARIANT_RQDM_QB_ID } from 'views/Snv/utils/constant';

export const CNV_EXPLORATION_PATIENT_FILTER_TAG = 'cnv_exploration_patient';
export const SNV_EXPLORATION_PATIENT_FILTER_TAG = 'snv_exploration_patient';
export const VARIANT_RQDM_QB_ID_FILTER_TAG = 'snv_exploration_rqdm';

export const FILTER_TAG_QB_ID_MAPPING: Record<string, string> = {
  [CNV_EXPLORATION_PATIENT_FILTER_TAG]: CNV_VARIANT_PATIENT_QB_ID,
  [SNV_EXPLORATION_PATIENT_FILTER_TAG]: SNV_VARIANT_PATIENT_QB_ID,
  [VARIANT_RQDM_QB_ID_FILTER_TAG]: VARIANT_RQDM_QB_ID,
};
