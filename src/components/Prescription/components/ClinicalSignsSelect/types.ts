export const CLINICAL_SIGN_NA = 'NA';

export enum CLINICAL_SIGNS_FI_KEY {
  SIGNS = 'signs',
  NOT_OBSERVED_SIGNS = 'not_observed_signs',
  CLINIC_REMARK = 'comment',
}

export enum CLINICAL_SIGNS_ITEM_KEY {
  IS_OBSERVED = 'is_observed',
  AGE_CODE = 'age_code',
  TERM_VALUE = 'value',
  NAME = 'name',
}

export interface IClinicalSignItem {
  [CLINICAL_SIGNS_ITEM_KEY.TERM_VALUE]: string;
  [CLINICAL_SIGNS_ITEM_KEY.IS_OBSERVED]: boolean | string;
  [CLINICAL_SIGNS_ITEM_KEY.AGE_CODE]?: string;
  [CLINICAL_SIGNS_ITEM_KEY.NAME]: string;
}

export interface IClinicalSignsDataType {
  [CLINICAL_SIGNS_FI_KEY.SIGNS]: IClinicalSignItem[];
  [CLINICAL_SIGNS_FI_KEY.NOT_OBSERVED_SIGNS]?: IClinicalSignItem[];
  [CLINICAL_SIGNS_FI_KEY.CLINIC_REMARK]?: string;
}
