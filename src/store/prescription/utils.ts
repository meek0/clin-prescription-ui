import {
  FOETUS_TYPE,
  HybridAnalysis,
  HybridPatient,
  HybridPatientFoetusForm,
  HybridPatientNotPresent,
  HybridPatientPresent,
} from 'api/hybrid/models';

import { STEPS_ID } from 'components/Prescription/Analysis/AnalysisForm/ReusableSteps/constant';
import {
  ClinicalStatusValue,
  TParentDataType,
} from 'components/Prescription/Analysis/AnalysisForm/ReusableSteps/ParentIdentification/types';
import { TProbandDataType } from 'components/Prescription/Analysis/AnalysisForm/ReusableSteps/PatientIdentification/types';
import { IClinicalSignsDataType } from 'components/Prescription/components/ClinicalSignsSelect/types';
import { ParaclinicalExamStatus } from 'components/Prescription/components/ParaclinicalExamsSelect/types';
import { IPatientDataType } from 'components/Prescription/components/PatientDataSearch/types';

import { TCompleteAnalysis } from './types';

export function getAnalysisFromFormData(analysis: TCompleteAnalysis): HybridAnalysis {
  const analysisCopy: TCompleteAnalysis = JSON.parse(JSON.stringify(analysis));
  const patients: HybridPatient[] = [];

  // Get proband
  if (analysisCopy.proband) {
    const clinical = getFormsClinicalSigns(analysisCopy?.proband_clinical, true);
    const proband = {
      family_member: 'PROBAND',
      ...cleanPatientFormData(analysisCopy.proband),
      clinical,
      para_clinical: analysisCopy.proband_paraclinical
        ? {
            exams: analysisCopy.proband_paraclinical.exams
              .filter((exam) => exam.interpretation !== ParaclinicalExamStatus.NOT_DONE)
              .map((exam) => ({
                code: exam.code,
                interpretation: exam.interpretation,
                values: exam.value ? [exam.value] : exam.values,
              })),
            other: analysisCopy.proband_paraclinical.other,
          }
        : undefined,
    } as HybridPatientPresent;

    // Foetus
    if ((analysisCopy.proband?.foetus as HybridPatientFoetusForm)?.is_prenatal_diagnosis) {
      proband!.foetus!.type = FOETUS_TYPE.PRENATAL;
      delete (proband.foetus as HybridPatientFoetusForm)!.is_prenatal_diagnosis;
    } else if ((analysisCopy.proband?.foetus as HybridPatientFoetusForm)?.is_new_born) {
      proband!.foetus!.type = FOETUS_TYPE.NEW_BORN;
      delete (proband.foetus as HybridPatientFoetusForm)!.is_new_born;
    } else {
      delete proband.foetus;
    }

    patients.push(proband);
  }

  // Parents
  for (const familyMember of [STEPS_ID.MOTHER_IDENTIFICATION, STEPS_ID.FATHER_IDENTIFICATION]) {
    const patientData: TParentDataType = analysisCopy[familyMember as keyof TCompleteAnalysis];
    if (!patientData) continue;

    const affected =
      patientData.status !== `NOW` ||
      patientData.parent_clinical_status === ClinicalStatusValue.UNKNOWN
        ? undefined
        : patientData.parent_clinical_status === ClinicalStatusValue.AFFECTED;

    patients.push({
      ...(cleanPatientFormData(patientData) as TParentDataType),
      clinical: affected ? getFormsClinicalSigns(patientData) : undefined,
      affected,
      family_member: familyMember.toUpperCase(),
    });
  }

  return {
    type: 'GERMLINE',
    analysis_code: analysisCopy.analysis?.panel_code,
    is_reflex: analysisCopy.analysis?.is_reflex,
    comment: analysisCopy.submission?.comment,
    resident_supervisor_id: analysisCopy.analysis?.resident_supervisor_id,
    history: [],
    ...analysisCopy.history_and_diagnosis,
    ...analysisCopy.project,
    patients,
  };
}

function cleanPatientFormData(patient: IPatientDataType | TProbandDataType) {
  const cleanPatient: IPatientDataType | TProbandDataType = JSON.parse(JSON.stringify(patient));

  // Clean jhn
  const cleanJhn = (jhn: string) => jhn.replace(/\s/g, '');
  if (cleanPatient.jhn) cleanPatient.jhn = cleanJhn(cleanPatient.jhn);
  if ((cleanPatient as TProbandDataType).foetus?.mother_jhn)
    (cleanPatient as TProbandDataType).foetus!.mother_jhn = cleanJhn(
      (cleanPatient as TProbandDataType).foetus!.mother_jhn!,
    );

  // Remove fields not needed for the api
  if ((cleanPatient as any).foetus && !Object.keys((cleanPatient as any).foetus).length)
    delete (cleanPatient as any).foetus;
  delete (cleanPatient as any).no_jhn;
  delete (cleanPatient as any).no_mrn;
  delete (cleanPatient as any).parent_clinical_status;
  delete (cleanPatient as any).observed_signs;
  delete (cleanPatient as any).not_observed_signs;
  delete (cleanPatient as any).comment;
  delete (cleanPatient as any).sequencings;

  return cleanPatient;
}

function getFormsClinicalSigns(
  signsData?: IClinicalSignsDataType,
  isProband = false,
): HybridPatientPresent['clinical'] {
  const observedSigns = (signsData?.observed_signs || []).filter((sign) => sign.observed);

  if (!signsData || (isProband && !observedSigns.length)) return undefined;

  return {
    signs: [...observedSigns, ...(signsData.not_observed_signs || [])],
    comment: signsData.comment,
  };
}

export function getFormDataFromAnalysis(analysis: HybridAnalysis): TCompleteAnalysis {
  const analysisFormData: TCompleteAnalysis = {
    analysis: {
      is_reflex: analysis.is_reflex,
      panel_code: analysis.analysis_code,
      comment: analysis.comment,
      resident_supervisor_id: analysis.resident_supervisor_id,
    },
    history_and_diagnosis: {
      diagnosis_hypothesis: analysis.diagnosis_hypothesis,
      ethnicity_codes: analysis.ethnicity_codes,
      report_health_conditions: !!analysis.history?.length,
      history: analysis.history || [],
      inbreeding: analysis.inbreeding,
    },
    proband_clinical: {
      observed_signs: [],
      not_observed_signs: [],
    },
    project: {
      project: analysis.project || undefined,
    },
  };

  // Get proband
  const proband = analysis.patients[0] as HybridPatientPresent;
  delete proband.affected;
  analysisFormData.proband = {
    ...proband,
    no_mrn: !proband.mrn,
    no_jhn: !proband.jhn,
  };

  // Foetus
  if (analysisFormData.proband.foetus) {
    if (proband.foetus!.type === FOETUS_TYPE.PRENATAL) {
      analysisFormData.proband.foetus.is_prenatal_diagnosis = true;
    } else if (proband.foetus!.type === FOETUS_TYPE.NEW_BORN) {
      analysisFormData.proband.foetus.is_new_born = true;
    }
  }

  if (proband.clinical) {
    analysisFormData.proband_clinical = getClinicalSignsFromAnalysis(proband);
  }

  if (proband.para_clinical) {
    analysisFormData.proband_paraclinical = proband.para_clinical;
  }

  // Get parents
  for (let i = 1; i < analysis.patients.length; i++) {
    const patient = analysis.patients[i];
    const parent_clinical_status = getClinicalStatus(patient as HybridPatientPresent);
    const patientClinical = getClinicalSignsFromAnalysis(patient as HybridPatientPresent);
    const parentLater = (patient as HybridPatientNotPresent).status !== 'NOW';
    const patientData = {
      ...(patient as HybridPatientNotPresent),
      organization_id:
        (patient as HybridPatientPresent).organization_id || proband?.organization_id || '',
      no_mrn: !parentLater && !(patient as HybridPatientPresent).mrn,
      no_jhn: !parentLater && !(patient as HybridPatientPresent).jhn,
      status: (patient as HybridPatientNotPresent).status || 'NOW',
      parent_clinical_status,
      ...patientClinical,
    } as TParentDataType;
    if (patient.family_member === 'FATHER') {
      analysisFormData.father = patientData;
    } else if (patient.family_member === 'MOTHER') {
      analysisFormData.mother = patientData;
    }
  }

  return analysisFormData;
}

function getClinicalSignsFromAnalysis(
  patient: HybridPatientPresent,
): IClinicalSignsDataType | undefined {
  if (patient.clinical) {
    const clinical: IClinicalSignsDataType = {
      observed_signs: [],
      not_observed_signs: [],
      comment: patient.clinical.comment,
    };
    for (const sign of patient.clinical.signs) {
      clinical[sign.observed ? 'observed_signs' : 'not_observed_signs'].push({ ...sign, name: '' });
    }
    return clinical;
  }
}

export function getClinicalStatus(patient: HybridPatientPresent) {
  return patient.affected === true
    ? ClinicalStatusValue.AFFECTED
    : patient.affected === false
    ? ClinicalStatusValue.NOT_AFFECTED
    : ClinicalStatusValue.UNKNOWN;
}

export function orderPatients(a: HybridPatient, b: HybridPatient) {
  const familyMemberValue = (familyMember: string) => {
    switch (familyMember) {
      case 'PROBAND':
        return 0;
      case 'MOTHER':
        return 1;
      case 'FATHER':
        return 3;
      default:
        return 4;
    }
  };

  return familyMemberValue(a.family_member!) - familyMemberValue(b.family_member);
}
