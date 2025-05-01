import { HybridPatientFoetus } from 'api/hybrid/models';

import { IPatientDataType } from 'components/Prescription/components/PatientDataSearch/types';

export interface TProbandDataType extends IPatientDataType {
  patient_id?: string;
  foetus?: Omit<HybridPatientFoetus, 'type'> & {
    is_prenatal_diagnosis?: boolean;
    is_new_born?: boolean;
  };
}
