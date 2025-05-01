import { HybridPatientInfo } from 'api/hybrid/models';

export interface IPatientDataType extends HybridPatientInfo {
  no_mrn: boolean;
  no_jhn: boolean;
}
