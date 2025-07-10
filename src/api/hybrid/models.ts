export interface HybridPatientSign {
  code: string;
  observed: boolean;
  age_code?: string;
}

export interface HybridPatientExam {
  code: string;
  interpretation: string;
  values: string[];
}

export enum FOETUS_TYPE {
  NEW_BORN = 'NEW_BORN',
  PRENATAL = 'PRENATAL',
}

export interface HybridPatientFoetus {
  type: FOETUS_TYPE;
  sex: string;
  gestational_method: string;
  gestational_date: string;
  mother_jhn: string;
}

export interface HybridPatientFoetusForm extends HybridPatientFoetus {
  is_prenatal_diagnosis?: boolean;
  is_new_born?: boolean;
}

export interface HybridPatientInfo {
  first_name: string;
  last_name: string;
  jhn: string;
  mrn: string;
  sex: string;
  birth_date: string;
  organization_id: string;
}

export interface HybridPatientClinical {
  signs: HybridPatientSign[];
  comment?: string;
}

export interface HybridPatientParaClinical {
  exams: HybridPatientExam[];
  other?: string;
}

export interface HybridPatientPresent extends HybridPatientInfo {
  patient_id?: string;
  family_member: string;
  affected?: boolean;
  foetus?: HybridPatientFoetus;
  clinical?: HybridPatientClinical;
  para_clinical?: HybridPatientParaClinical;
  sequencings?: {
    sequencing_id: string;
    type: 'WXS' | 'WTS';
  }[];
}

export interface HybridPatientNotPresent {
  family_member: string;
  status: 'NOW' | 'LATER' | 'NEVER';
  reason: string;
}

export type HybridPatient = HybridPatientPresent | HybridPatientNotPresent;

export interface HybridAnalysis {
  analysis_id?: string;
  type: string;
  analysis_code: string;
  status?: string;
  authored_on?: string;
  requester?: string;
  performer?: string;
  is_reflex: boolean;
  comment?: string;
  inbreeding?: boolean;
  resident_supervisor_id?: string;
  priority?: string;
  history: {
    condition: string;
    parental_link_code: string;
  }[];
  diagnosis_hypothesis?: string;
  ethnicity_codes?: string[];
  patients: HybridPatient[];
}

export interface IHybridPatientForm {
  first_name: string;
  last_name: string;
  sex: string;
  organization_id: string;
  birth_date: string;
  jhn: string;
  mrn: string;
}

export function getProband(analysis?: HybridAnalysis) {
  return analysis?.patients[0] as HybridPatientPresent;
}
