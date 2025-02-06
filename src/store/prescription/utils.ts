import {
  CLINICAL_SIGNS_ITEM_KEY,
  IClinicalSignsDataType,
} from 'components/Prescription/components/ClinicalSignsSelect/types';
import { IClinicalSignItem } from 'components/Prescription/components/ClinicalSignsSelect/types';
import {
  IParaclinicalExamItem,
  IParaclinicalExamsDataType,
  PARACLINICAL_EXAM_ITEM_KEY,
  PARACLINICAL_EXAMS_FI_KEY,
  ParaclinicalExamStatus,
} from 'components/Prescription/components/ParaclinicalExamsSelect';

import { TCompleteAnalysis } from './types';

export const cleanAnalysisData = (analysis: TCompleteAnalysis) => {
  const analysisCopy = JSON.parse(JSON.stringify(analysis));
  if (analysisCopy.submission)
    analysisCopy.analysis.comment = analysisCopy.submission.general_comment;

  if (analysisCopy.paraclinical_exams) {
    analysisCopy.paraclinical_exams = cleanParaclinicalExams(analysisCopy.paraclinical_exams);
  }

  if (analysisCopy.clinical_signs) {
    analysisCopy.clinical_signs = cleanClinicalSigns(analysisCopy.clinical_signs);
  }

  if (analysisCopy.mother?.signs) {
    analysisCopy.mother = cleanClinicalSigns(analysisCopy.mother);
  }

  if (analysisCopy.mother?.ramq) {
    analysisCopy.mother.ramq = analysisCopy.mother.ramq.replace(/\s/g, '');
  }

  if (analysisCopy.father?.signs) {
    analysisCopy.father = cleanClinicalSigns(analysisCopy.father);
  }

  if (analysisCopy.father?.ramq) {
    analysisCopy.father.ramq = analysisCopy.father.ramq.replace(/\s/g, '');
  }

  if (analysisCopy.patient?.ramq) {
    analysisCopy.patient.ramq = analysisCopy.patient.ramq.replace(/\s/g, '');
  }

  if (analysisCopy.patient?.additional_info.mother_ramq) {
    analysisCopy.patient.additional_info.mother_ramq =
      analysisCopy.patient.additional_info.mother_ramq.replace(/\s/g, '');
  }

  return analysisCopy;
};

const cleanParaclinicalExams = (
  paraclinicalData: IParaclinicalExamsDataType,
): IParaclinicalExamsDataType => {
  const exams: IParaclinicalExamItem[] = [];
  paraclinicalData[PARACLINICAL_EXAMS_FI_KEY.EXAMS]?.forEach((exam) => {
    if (exam[PARACLINICAL_EXAM_ITEM_KEY.INTERPRETATION] !== ParaclinicalExamStatus.NOT_DONE)
      exams.push({
        [PARACLINICAL_EXAM_ITEM_KEY.INTERPRETATION]:
          exam[PARACLINICAL_EXAM_ITEM_KEY.INTERPRETATION],
        [PARACLINICAL_EXAM_ITEM_KEY.CODE]: exam[PARACLINICAL_EXAM_ITEM_KEY.CODE],
        [PARACLINICAL_EXAM_ITEM_KEY.VALUES]: exam[PARACLINICAL_EXAM_ITEM_KEY.VALUE]
          ? [exam[PARACLINICAL_EXAM_ITEM_KEY.VALUE]]
          : exam[PARACLINICAL_EXAM_ITEM_KEY.VALUES],
      });
  });
  return {
    ...paraclinicalData,
    exams,
  };
};

const cleanClinicalSigns = (clinicalSigns: IClinicalSignsDataType): IClinicalSignsDataType => {
  const { not_observed_signs, signs, ...rest } = clinicalSigns;
  const cleanedObservedSigns =
    signs?.filter((sign) => sign[CLINICAL_SIGNS_ITEM_KEY.IS_OBSERVED] === true) || [];
  const cleanedNotObservedSigns: IClinicalSignItem[] =
    (not_observed_signs || [])?.map((sign) => ({
      ...sign,
      is_observed: false,
    })) || [];

  return {
    ...rest,
    signs: cleanedObservedSigns.concat(cleanedNotObservedSigns),
  };
};
