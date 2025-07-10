import { HybridPatientSign } from 'api/hybrid/models';

export interface IClinicalSignItem extends HybridPatientSign {
  name: string;
}

export interface IClinicalSignsDataType {
  observed_signs: IClinicalSignItem[];
  not_observed_signs: IClinicalSignItem[];
  comment?: string;
}
