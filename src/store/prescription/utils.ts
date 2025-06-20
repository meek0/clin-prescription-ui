import {
  HybridPatient,
  HybridPatientPresent,
  HybridPatientSign,
  HybridPrescription,
} from 'api/hybrid/models';

import { TClinicalSignsDataType } from 'components/Prescription/Analysis/AnalysisForm/ReusableSteps/ClinicalSigns';
import { STEPS_ID } from 'components/Prescription/Analysis/AnalysisForm/ReusableSteps/constant';
import {
  ClinicalStatusValue,
  EnterInfoMomentValue,
  PARENT_DATA_FI_KEY,
  TParentDataType,
} from 'components/Prescription/Analysis/AnalysisForm/ReusableSteps/ParentIdentification/types';
import { TPatientFormDataType } from 'components/Prescription/Analysis/AnalysisForm/ReusableSteps/PatientIdentification';
import {
  ADD_INFO_FI_KEY,
  additionalInfoKey,
} from 'components/Prescription/Analysis/AnalysisForm/ReusableSteps/PatientIdentification/AdditionalInformation';
import {
  CLINICAL_SIGNS_FI_KEY,
  CLINICAL_SIGNS_ITEM_KEY,
  IClinicalSignsDataType,
} from 'components/Prescription/components/ClinicalSignsSelect/types';
import { IClinicalSignItem } from 'components/Prescription/components/ClinicalSignsSelect/types';
import {
  HEALTH_CONDITION_ITEM_KEY,
  HISTORY_AND_DIAG_FI_KEY,
} from 'components/Prescription/components/HistoryAndDiagnosisData';
import {
  IParaclinicalExamItem,
  IParaclinicalExamsDataType,
  PARACLINICAL_EXAM_ITEM_KEY,
  PARACLINICAL_EXAMS_FI_KEY,
  ParaclinicalExamStatus,
} from 'components/Prescription/components/ParaclinicalExamsSelect';
import { PATIENT_DATA_FI_KEY } from 'components/Prescription/components/PatientDataSearch/types';

import { TCompleteAnalysis } from './types';

// eslint-disable-next-line complexity
export function cleanAnalysisData(analysis: TCompleteAnalysis): HybridPrescription {
  const analysisCopy: TCompleteAnalysis = JSON.parse(JSON.stringify(analysis));
  if (analysisCopy.submission)
    analysisCopy.analysis.comment = analysisCopy.submission.general_comment;

  if (analysisCopy.paraclinical_exams) {
    analysisCopy.paraclinical_exams = cleanParaclinicalExams(analysisCopy.paraclinical_exams);
  }

  if (analysisCopy.clinical_signs) {
    analysisCopy.clinical_signs = cleanClinicalSigns(analysisCopy.clinical_signs);
  }

  if (analysisCopy.history_and_diagnosis && !Object.keys(analysisCopy.history_and_diagnosis).length)
    delete analysisCopy.history_and_diagnosis;

  if (analysisCopy.mother && !Object.keys(analysisCopy.mother).length) delete analysisCopy.mother;

  if (analysisCopy.mother?.signs) {
    analysisCopy.mother = cleanClinicalSigns(analysisCopy.mother);
  }

  if (analysisCopy.mother?.ramq) {
    analysisCopy.mother.ramq = analysisCopy.mother.ramq.replace(/\s/g, '');
  }

  if (analysisCopy.father && !Object.keys(analysisCopy.father).length) delete analysisCopy.father;

  if (analysisCopy.father?.signs) {
    analysisCopy.father = cleanClinicalSigns(analysisCopy.father);
  }

  if (analysisCopy.father?.ramq) {
    analysisCopy.father.ramq = analysisCopy.father.ramq.replace(/\s/g, '');
  }

  if (analysisCopy.patient?.ramq) {
    analysisCopy.patient.ramq = analysisCopy.patient.ramq.replace(/\s/g, '');
  }

  if (analysisCopy.patient?.additional_info?.mother_ramq) {
    analysisCopy.patient.additional_info.mother_ramq =
      analysisCopy.patient.additional_info.mother_ramq.replace(/\s/g, '');
  }

  const patients: HybridPatient[] = [];

  const proband: HybridPatient = getPatientData(analysisCopy.patient!, 'PROBAND');
  patients.push(proband);

  // Add foetus or newborn data to proband
  if (
    analysisCopy[STEPS_ID.PATIENT_IDENTIFICATION]?.[additionalInfoKey]?.[
      ADD_INFO_FI_KEY.PRENATAL_DIAGNOSIS
    ] ||
    analysisCopy[STEPS_ID.PATIENT_IDENTIFICATION]?.[additionalInfoKey]?.[ADD_INFO_FI_KEY.NEW_BORN]
  ) {
    const foetusData = analysisCopy[STEPS_ID.PATIENT_IDENTIFICATION][additionalInfoKey];
    (proband as HybridPatientPresent).foetus = {
      type: foetusData[ADD_INFO_FI_KEY.PRENATAL_DIAGNOSIS]
        ? 'PRENATAL'
        : foetusData[ADD_INFO_FI_KEY.NEW_BORN]
        ? 'NEW_BORN'
        : 'UNKNOWN',
      sex: foetusData[ADD_INFO_FI_KEY.FOETUS_SEX]?.toUpperCase(),
      gestational_method: foetusData[ADD_INFO_FI_KEY.GESTATIONAL_AGE]?.toUpperCase(),
      gestational_date: foetusData[ADD_INFO_FI_KEY.GESTATIONAL_DATE_DPA],
      mother_jhn: foetusData[ADD_INFO_FI_KEY.MOTHER_RAMQ_NUMBER],
    };
  }

  // Add clinical signs to proband
  if (analysisCopy[STEPS_ID.CLINICAL_SIGNS]?.[CLINICAL_SIGNS_FI_KEY.SIGNS].length) {
    (proband as HybridPatientPresent).clinical = getClinicalSigns(
      analysisCopy[STEPS_ID.CLINICAL_SIGNS],
    );
  }

  // Add para clinical signs to proband
  if (analysisCopy[STEPS_ID.PARACLINICAL_EXAMS]?.[PARACLINICAL_EXAMS_FI_KEY.EXAMS].length) {
    (proband as HybridPatientPresent).para_clinical = {
      exams: analysisCopy[STEPS_ID.PARACLINICAL_EXAMS][PARACLINICAL_EXAMS_FI_KEY.EXAMS].map(
        (exam) => ({
          code: exam[PARACLINICAL_EXAM_ITEM_KEY.CODE],
          interpretation: exam[PARACLINICAL_EXAM_ITEM_KEY.INTERPRETATION]?.toUpperCase(),
          values: exam[PARACLINICAL_EXAM_ITEM_KEY.VALUES],
        }),
      ),
      other: analysisCopy[STEPS_ID.PARACLINICAL_EXAMS][PARACLINICAL_EXAMS_FI_KEY.OTHER_EXAMS],
    };
  }

  if (analysisCopy[STEPS_ID.MOTHER_IDENTIFICATION]) {
    const motherData = analysisCopy[STEPS_ID.MOTHER_IDENTIFICATION];
    patients.push(getParent(motherData, 'MOTHER'));
  }

  if (analysisCopy[STEPS_ID.FATHER_IDENTIFICATION]) {
    const fatherData = analysisCopy[STEPS_ID.FATHER_IDENTIFICATION];
    patients.push(getParent(fatherData, 'FATHER'));
  }

  const hybridPrescritpion: HybridPrescription = {
    type: 'GERMLINE',
    analysis_code: analysisCopy.analysis?.panel_code,
    is_reflex: analysisCopy.analysis?.is_reflex,
    inbreeding: analysisCopy.history_and_diagnosis?.[HISTORY_AND_DIAG_FI_KEY.HAS_INBREEDING],
    comment: analysisCopy.analysis?.comment,
    resident_supervisor_id: analysisCopy.analysis?.resident_supervisor,
    history:
      analysisCopy[STEPS_ID.HISTORY_AND_DIAGNOSIS]?.[
        HISTORY_AND_DIAG_FI_KEY.HEALTH_CONDITIONS
      ]?.map((healthCondition) => ({
        condition: healthCondition[HEALTH_CONDITION_ITEM_KEY.CONDITION],
        parental_link_code: healthCondition[HEALTH_CONDITION_ITEM_KEY.PARENTAL_LINK],
      })) || [],
    diagnosis_hypothesis:
      analysisCopy.history_and_diagnosis?.[HISTORY_AND_DIAG_FI_KEY.DIAGNOSIS_HYPOTHESIS],
    ethnicity_codes: analysisCopy.history_and_diagnosis?.[
      HISTORY_AND_DIAG_FI_KEY.ETHNICITY
    ]?.filter((eth) => !!eth),
    patients,
  };

  return hybridPrescritpion;
}

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

function cleanClinicalSigns<T extends TParentDataType | TClinicalSignsDataType>(
  clinicalSigns: T,
): T {
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
  } as T;
}

function getPatientData(patient: TPatientFormDataType, family_member: string): HybridPatient {
  return {
    first_name: patient[PATIENT_DATA_FI_KEY.FIRST_NAME],
    last_name: patient[PATIENT_DATA_FI_KEY.LAST_NAME],
    jhn: patient[PATIENT_DATA_FI_KEY.RAMQ_NUMBER],
    mrn: patient[PATIENT_DATA_FI_KEY.FILE_NUMBER],
    sex: patient[PATIENT_DATA_FI_KEY.SEX]?.toUpperCase(),
    birth_date: patient[PATIENT_DATA_FI_KEY.BIRTH_DATE],
    organization_id: patient[PATIENT_DATA_FI_KEY.PRESCRIBING_INSTITUTION],
    family_member,
  };
}

function getClinicalSigns(signsData: IClinicalSignsDataType): HybridPatientPresent['clinical'] {
  return {
    signs: signsData[CLINICAL_SIGNS_FI_KEY.SIGNS].map(
      (sign) =>
        ({
          code: sign[CLINICAL_SIGNS_ITEM_KEY.TERM_VALUE],
          observed: sign[CLINICAL_SIGNS_ITEM_KEY.IS_OBSERVED],
          age_code: sign[CLINICAL_SIGNS_ITEM_KEY.AGE_CODE],
        } as HybridPatientSign),
    ),
    comment: signsData[CLINICAL_SIGNS_FI_KEY.CLINIC_REMARK],
  };
}

function getParent(parentData: TParentDataType, family_member: 'MOTHER' | 'FATHER'): HybridPatient {
  let parent: HybridPatient;
  switch (parentData[PARENT_DATA_FI_KEY.ENTER_INFO_MOMENT]) {
    case EnterInfoMomentValue.LATER:
    case EnterInfoMomentValue.NEVER:
      parent = {
        family_member,
        status: parentData[PARENT_DATA_FI_KEY.ENTER_INFO_MOMENT].toUpperCase(),
        reason: parentData[PARENT_DATA_FI_KEY.NO_INFO_REASON],
      };
      break;
    case EnterInfoMomentValue.NOW:
      parent = getPatientData(parentData as TPatientFormDataType, family_member);
      parent.status = parentData[PARENT_DATA_FI_KEY.ENTER_INFO_MOMENT].toUpperCase();
      switch (parentData[PARENT_DATA_FI_KEY.CLINICAL_STATUS]) {
        case ClinicalStatusValue.AFFECTED:
          (parent as HybridPatientPresent).clinical = getClinicalSigns(
            parentData as IClinicalSignsDataType,
          );
          (parent as HybridPatientPresent).affected = true;
          break;
        case ClinicalStatusValue.NOT_AFFECTED:
          (parent as HybridPatientPresent).affected = false;
          break;
      }
  }
  return parent;
}
