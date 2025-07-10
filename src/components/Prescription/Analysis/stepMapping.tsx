import { IClinicalSignsDataType } from '../components/ClinicalSignsSelect/types';
import { IHistoryAndDiagnosisDataType } from '../components/HistoryAndDiagnosisData/types';
import { IParaclinicalExamsDataType } from '../components/ParaclinicalExamsSelect/types';

import AddParentSubmission from './AnalysisForm/ReusableSteps/AddParentSubmission';
import ClinicalSigns from './AnalysisForm/ReusableSteps/ClinicalSigns';
import ClinicalSignsReview from './AnalysisForm/ReusableSteps/ClinicalSigns/Review';
import { STEPS_ID } from './AnalysisForm/ReusableSteps/constant';
import HistoryAndDiagnosticHypothesis from './AnalysisForm/ReusableSteps/HistoryAndDiagnosticHypothesis';
import HistoryAndDiagnosisReview from './AnalysisForm/ReusableSteps/HistoryAndDiagnosticHypothesis/Review';
import ParaclinicalExams from './AnalysisForm/ReusableSteps/ParaclinicalExams';
import ParaclinicalExamsReview from './AnalysisForm/ReusableSteps/ParaclinicalExams/Review';
import ParentIdentification from './AnalysisForm/ReusableSteps/ParentIdentification';
import ParentIdentificationReview from './AnalysisForm/ReusableSteps/ParentIdentification/Review';
import { TParentDataType } from './AnalysisForm/ReusableSteps/ParentIdentification/types';
import PatientIdentification from './AnalysisForm/ReusableSteps/PatientIdentification';
import PatientIdentificationReview from './AnalysisForm/ReusableSteps/PatientIdentification/Review';
import { TProbandDataType } from './AnalysisForm/ReusableSteps/PatientIdentification/types';
import Submission from './AnalysisForm/ReusableSteps/Submission';

export const StepsMapping = {
  [STEPS_ID.PROBAND_IDENTIFICATION]: <PatientIdentification />,
  [STEPS_ID.PROBAND_CLINICAL]: <ClinicalSigns />,
  [STEPS_ID.PROBAND_PARACLINICAL]: <ParaclinicalExams />,
  [STEPS_ID.HISTORY_AND_DIAGNOSIS]: <HistoryAndDiagnosticHypothesis />,
  [STEPS_ID.MOTHER_IDENTIFICATION]: <ParentIdentification key="mother" parent="mother" />,
  [STEPS_ID.FATHER_IDENTIFICATION]: <ParentIdentification key="father" parent="father" />,
  [STEPS_ID.SUBMISSION]: <Submission />,
  [STEPS_ID.ADD_PARENT_SUBMISSION]: <AddParentSubmission />,
};

export const SubmissionStepMapping = {
  [STEPS_ID.PROBAND_IDENTIFICATION]: <PatientIdentificationReview />,
  [STEPS_ID.PROBAND_CLINICAL]: <ClinicalSignsReview />,
  [STEPS_ID.PROBAND_PARACLINICAL]: <ParaclinicalExamsReview />,
  [STEPS_ID.HISTORY_AND_DIAGNOSIS]: <HistoryAndDiagnosisReview />,
  [STEPS_ID.MOTHER_IDENTIFICATION]: (
    <ParentIdentificationReview key="mother-review" parentType={STEPS_ID.MOTHER_IDENTIFICATION} />
  ),
  [STEPS_ID.FATHER_IDENTIFICATION]: (
    <ParentIdentificationReview key="father-review" parentType={STEPS_ID.FATHER_IDENTIFICATION} />
  ),
  [STEPS_ID.SUBMISSION]: <></>,
  [STEPS_ID.ADD_PARENT_SUBMISSION]: <></>,
};

export interface IAnalysisFormDataType {
  [STEPS_ID.PROBAND_IDENTIFICATION]?: TProbandDataType;
  [STEPS_ID.PROBAND_CLINICAL]?: IClinicalSignsDataType;
  [STEPS_ID.PROBAND_PARACLINICAL]?: IParaclinicalExamsDataType;
  [STEPS_ID.HISTORY_AND_DIAGNOSIS]?: IHistoryAndDiagnosisDataType;
  [STEPS_ID.MOTHER_IDENTIFICATION]?: TParentDataType;
  [STEPS_ID.FATHER_IDENTIFICATION]?: TParentDataType;
  [STEPS_ID.SUBMISSION]?: any;
}

export type IAnalysisStepDataType =
  | IClinicalSignsDataType
  | IParaclinicalExamsDataType
  | IHistoryAndDiagnosisDataType;
