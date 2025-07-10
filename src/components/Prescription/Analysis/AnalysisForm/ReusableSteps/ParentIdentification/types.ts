import { HybridPatientNotPresent } from 'api/hybrid/models';

import { IClinicalSignsDataType } from 'components/Prescription/components/ClinicalSignsSelect/types';
import { IPatientDataType } from 'components/Prescription/components/PatientDataSearch/types';

export enum PARENT_DATA_FI_KEY {
  CLINICAL_STATUS = 'parent_clinical_status',
}

export enum EnterInfoMomentValue {
  NOW = 'NOW',
  NEVER = 'NEVER',
  LATER = 'LATER',
}

export enum ClinicalStatusValue {
  AFFECTED = 'affected',
  NOT_AFFECTED = 'not_affected',
  UNKNOWN = 'unknown',
}

export type TParentDataType = IPatientDataType &
  HybridPatientNotPresent &
  IClinicalSignsDataType & {
    [PARENT_DATA_FI_KEY.CLINICAL_STATUS]: ClinicalStatusValue;
  };
