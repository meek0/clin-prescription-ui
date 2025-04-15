import { IClinicalSignsDataType } from 'components/Prescription/components/ClinicalSignsSelect/types';
import { IPatientDataType } from 'components/Prescription/components/PatientDataSearch/types';

export enum PARENT_DATA_FI_KEY {
  ENTER_INFO_MOMENT = 'parent_enter_moment',
  NO_INFO_REASON = 'parent_no_info_reason',
  CLINICAL_STATUS = 'parent_clinical_status',
}

export enum EnterInfoMomentValue {
  NOW = 'now',
  NEVER = 'never',
  LATER = 'later',
}

export enum ClinicalStatusValue {
  AFFECTED = 'affected',
  NOT_AFFECTED = 'not_affected',
  UNKNOWN = 'unknown',
}

export type TParentDataType = IPatientDataType &
  IClinicalSignsDataType & {
    [PARENT_DATA_FI_KEY.CLINICAL_STATUS]: ClinicalStatusValue;
    [PARENT_DATA_FI_KEY.ENTER_INFO_MOMENT]: EnterInfoMomentValue;
    [PARENT_DATA_FI_KEY.NO_INFO_REASON]: string;
  };
