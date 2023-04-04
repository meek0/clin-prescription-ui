import { TFormConfig } from 'api/form/models';
import { ValidateFields } from 'rc-field-form/lib/interface';

import { STEPS_ID } from 'components/Prescription/Analysis/AnalysisForm/ReusableSteps/constant';
import { IAnalysisDataType } from 'components/Prescription/Analysis/stepMapping';

export type initialState = {
  analysisChoiceModalVisible: boolean;
  addParentModalVisible: boolean;
  prescriptionVisible: boolean;
  currentFormRefs?: ICurrentFormRefs;
  currentStep?: IAnalysisStep;
  analysisType?: AnalysisType;
  config?: IAnalysisConfig;
  analysisData: TCompleteAnalysis;
  lastStepIsNext?: boolean;
  isAddingParent?: boolean;
  isCreatingPrescription: boolean;
  formState: {
    config?: TFormConfig;
    isLoadingConfig: boolean;
  };
};

export type TCompleteAnalysis = IAnalysisDataType & {
  analysis: {
    panel_code: string;
    is_reflex: boolean;
    observation?: string;
    investigation?: string;
    indication?: string;
    resident_supervisor?: string;
    comment?: string;
  };
};

export interface ICurrentFormRefs {
  sumbit: () => void;
  validateFields: ValidateFields;
  getFieldsValue: () => any;
}

// TODO Probably change with backend values??
export enum MuscularAnalysisType {
  MUSCULAR_DISEASE_GLOBAL = 'MMG', // MMG
  MUSCULAR_DISEASE_DYSTROPHIES = 'DYSM', // DYSM
  MUSCULAR_DISEASE_MALIGNANT_HYPERTHERMIA = 'HYPM', // HYPM
  MUSCULAR_DISEASE_CONGENITAL_MYASTHENIA = 'MYAC', // MYAC
  MUSCULAR_DISEASE_CONGENITAL_MYOPATHIES = 'MYOC', // MYOC
  MUSCULAR_DISEASE_RHABDOMYOLYSIS = 'RHAB', // RHAB
}

export enum OtherAnalysisType {
  GLOBAL_DEVELOPMENTAL_DELAY = 'RGDI', // RGDI
  NUCLEAR_MITOCHONDRIOPATHY = 'MITN', // MITN
}

export type AnalysisType = MuscularAnalysisType | OtherAnalysisType;

export interface ICompleteAnalysisChoice {
  type: AnalysisType;
  extraData: {
    isReflex?: boolean;
  };
}

export interface ISubmissionStepDataReview {
  resident_supervisor?: string;
  comment?: string;
}

export interface IStartAddingParent {
  selectedAnalysis: any; // Will need to match to backend data model
  stepId: STEPS_ID.FATHER_IDENTIFICATION | STEPS_ID.MOTHER_IDENTIFICATION;
}

export interface IAnalysisConfig {
  analysisTitle: string;
  steps: IAnalysisStep[];
}

export interface IAnalysisStep {
  title: string;
  id: STEPS_ID;
  index?: number;
  previousStepIndex?: number;
  nextStepIndex?: number;
}
