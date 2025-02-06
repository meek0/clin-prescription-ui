export interface HybridPatientSign {
  code: string;
  observed: boolean;
  age_code: string;
}

export interface HybridPatientExam {
  code: string;
  interpretation: string;
  values: string[];
}

export interface HybridPatientPresent {
  patient_id: string;
  first_name: string;
  last_name: string;
  jhn: string;
  mrn: string;
  sex: string;
  birth_date: string;
  organization_id: string;
  family_member: string;
  affected: boolean;
  foetus?: {
    type: string;
    sex: string;
    gestational_method: string;
    gestational_date: string;
    mother_jhn: string;
  };
  clinical: {
    signs: HybridPatientSign[];
    comment: string;
  };
  para_clinical: {
    exams: HybridPatientExam[];
    other: string;
  };
}

export interface HybridPatientNotPresent {
  family_member: string;
  status: string;
  reason: string;
}

export type HybridPatient = HybridPatientPresent | HybridPatientNotPresent;

export interface HybridPrescription {
  analysis_id: string;
  type: string;
  analysis_code: string;
  is_reflex: boolean;
  comment: string;
  inbreeding: string;
  history: {
    condition: string;
    parental_link_code: string;
  }[];
  diagnosis_hypothesis: string;
  ethnicity_code: string;
  patients: HybridPatient[];
}
