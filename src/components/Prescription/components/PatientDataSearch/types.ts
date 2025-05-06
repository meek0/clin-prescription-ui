import { SexValue } from 'utils/commonTypes';

export enum PATIENT_DATA_FI_KEY {
  PATIENT_ID = 'id',
  PRESCRIBING_INSTITUTION = 'ep',
  FILE_NUMBER = 'mrn',
  NO_FILE = 'no_mrn',
  RAMQ_NUMBER = 'ramq',
  NO_RAMQ = 'no_ramq',
  LAST_NAME = 'last_name',
  FIRST_NAME = 'first_name',
  BIRTH_DATE = 'birth_date',
  SEX = 'sex',
}

export interface IPatientDataType {
  [PATIENT_DATA_FI_KEY.PATIENT_ID]: string;
  [PATIENT_DATA_FI_KEY.PRESCRIBING_INSTITUTION]: string;
  [PATIENT_DATA_FI_KEY.BIRTH_DATE]: string;
  [PATIENT_DATA_FI_KEY.FILE_NUMBER]: string;
  [PATIENT_DATA_FI_KEY.NO_FILE]: boolean;
  [PATIENT_DATA_FI_KEY.RAMQ_NUMBER]: string;
  [PATIENT_DATA_FI_KEY.NO_RAMQ]: boolean;
  [PATIENT_DATA_FI_KEY.LAST_NAME]: string;
  [PATIENT_DATA_FI_KEY.FIRST_NAME]: string;
  [PATIENT_DATA_FI_KEY.SEX]: SexValue;
}
