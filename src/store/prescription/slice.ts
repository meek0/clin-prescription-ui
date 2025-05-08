import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  HybridPatient,
  HybridPatientNotPresent,
  HybridPatientPresent,
  HybridPrescription,
} from 'api/hybrid/models';
import { logout } from 'auth/keycloak';
import { RptManager } from 'auth/rpt';
import { isUndefined } from 'lodash';
import _ from 'lodash';

import {
  EnterInfoMomentValue,
  PARENT_DATA_FI_KEY,
} from 'components/Prescription/Analysis/AnalysisForm/ReusableSteps/ParentIdentification/types';
import { TPatientFormDataType } from 'components/Prescription/Analysis/AnalysisForm/ReusableSteps/PatientIdentification';
// eslint-disable-next-line max-len
import { GestationalAgeValues } from 'components/Prescription/Analysis/AnalysisForm/ReusableSteps/PatientIdentification/AdditionalInformation';
import {
  IClinicalSignItem,
  IClinicalSignsDataType,
} from 'components/Prescription/components/ClinicalSignsSelect/types';
import { IHistoryAndDiagnosisDataType } from 'components/Prescription/components/HistoryAndDiagnosisData';
import { IParaclinicalExamsDataType } from 'components/Prescription/components/ParaclinicalExamsSelect';
import { PATIENT_DATA_FI_KEY } from 'components/Prescription/components/PatientDataSearch/types';
import { DevelopmentDelayConfig } from 'store/prescription/analysis/developmentDelay';
import { MuscularDiseaseConfig } from 'store/prescription/analysis/muscular';
import { isMuscularAnalysis } from 'store/prescription/helper';
import {
  AnalysisType,
  IAnalysisConfig,
  IAnalysisStep,
  ICompleteAnalysisChoice,
  ICurrentFormRefs,
  initialState,
  IStartAddingParent,
  ISubmissionStepDataReview,
} from 'store/prescription/types';
import { SexValue } from 'utils/commonTypes';

import { getAddParentSteps } from './analysis/addParent';
import { createPrescription, fetchFormConfig } from './thunk';

export const PrescriptionState: initialState = {
  prescriptionVisible: false,
  addParentModalVisible: false,
  analysisChoiceModalVisible: false,
  currentStep: undefined,
  config: undefined,
  isCreatingPrescription: false,
  analysisData: {
    analysis: {
      panel_code: '',
      is_reflex: false,
    },
  },
  formState: {
    config: undefined,
    isLoadingConfig: false,
  },
  prescriptionId: undefined,
};

export const getAnalysisConfigMapping = (type: AnalysisType) => {
  if (isMuscularAnalysis(type)) {
    return {
      ...MuscularDiseaseConfig,
      analysisTitle: type,
    };
  } else {
    return {
      ...DevelopmentDelayConfig,
      analysisTitle: type,
    };
  }
};

const enrichSteps = (steps: IAnalysisStep[]): IAnalysisStep[] =>
  steps.map((step, index) => ({
    ...step,
    index,
    previousStepIndex: index > 0 ? index - 1 : undefined,
    nextStepIndex: index < steps.length - 1 ? index + 1 : undefined,
  }));

const prescriptionFormSlice = createSlice({
  name: 'prescriptionForm',
  initialState: PrescriptionState,
  reducers: {
    saveStepData: (state, action: PayloadAction<any>) => {
      // The mergeWith option is used to replace array if array is empty (https://github.com/lodash/lodash/issues/1313)
      state.analysisData = _.mergeWith(state.analysisData, action.payload, (obj, src) =>
        !_.isNil(src) ? src : obj,
      );
    },
    prescriptionChanged: (state, action: PayloadAction<any>) => {
      state.analysisData.changed = action.payload;
    },
    setDraft: (state, action: PayloadAction<boolean>) => {
      state.isDraft = action.payload;
    },
    setSubmissionError: (state, action: PayloadAction<any>) => {
      state.submissionError = action.payload;
    },
    setDisplayActionModal: (
      state,
      action: PayloadAction<{
        displayActionModal: 'saved' | 'submitted' | 'error' | undefined;
        prescriptionVisible: boolean;
      }>,
    ) => {
      state.displayActionModal = action.payload.displayActionModal;
      state.prescriptionVisible = action.payload.prescriptionVisible;
    },
    goTo: (
      state,
      action: PayloadAction<{
        index: number;
        lastStepIsNext?: boolean;
      }>,
    ) => {
      if (state.currentFormRefs?.getFieldsValue) {
        state.analysisData = {
          ...state.analysisData,
          ...state.currentFormRefs.getFieldsValue(),
        };
      }
      state.currentStep = state.config?.steps[action.payload.index];
      state.lastStepIsNext = action.payload.lastStepIsNext;
    },
    goToLastStep: (state) => {
      state.currentStep = state.config?.steps[state.config?.steps.length - 1];
      state.lastStepIsNext = false;
    },
    nextStep: (state) => {
      if (RptManager.isStoredRptExpired()) {
        logout();
      }
      const nextStepIndex = state.currentStep?.nextStepIndex;
      if (!isUndefined(nextStepIndex)) {
        state.currentStep = state.config?.steps[nextStepIndex];
      }
    },
    previousStep: (state) => {
      if (RptManager.isStoredRptExpired()) {
        logout();
      }

      if (state.currentFormRefs?.getFieldsValue) {
        state.analysisData = {
          ...state.analysisData,
          ...state.currentFormRefs.getFieldsValue(),
        };
      }

      const previousStepIndex = state.currentStep?.previousStepIndex;
      if (!isUndefined(previousStepIndex)) {
        state.currentStep = state.config?.steps[previousStepIndex];
      }
    },
    cancel: () => ({
      ...PrescriptionState,
    }),
    clearForm: () => ({
      ...PrescriptionState,
    }),
    startAddParentChoice: (state) => {
      state.addParentModalVisible = true;
      state.isAddingParent = true;
    },
    completeAddParentChoice: (state, action: PayloadAction<IStartAddingParent>) => {
      const config: IAnalysisConfig = {
        analysisTitle: '',
        steps: enrichSteps(getAddParentSteps(action.payload.stepId)),
      };

      state.config = config;
      state.currentStep = config.steps[0];
      state.addParentModalVisible = false;
      state.prescriptionVisible = true;
    },
    startAnalyseChoice: (state) => {
      state.analysisChoiceModalVisible = true;
    },
    completeAnalysisChoice: (state, action: PayloadAction<ICompleteAnalysisChoice>) => {
      const config = getAnalysisConfigMapping(action.payload.type)!;
      config.steps = enrichSteps(config.steps);

      state.currentStep = config.steps[0];
      state.config = config;
      state.analysisType = action.payload.type;
      state.analysisChoiceModalVisible = false;
      state.prescriptionVisible = true;

      state.analysisData.analysis = {
        panel_code: action.payload.type,
        is_reflex: action.payload.extraData.isReflex ?? false,
      };
    },
    openFormForDraft: (state, action: PayloadAction<HybridPrescription>) => {
      const prescription = action.payload;
      const config = getAnalysisConfigMapping(prescription.analysis_code as AnalysisType)!;
      config.steps = enrichSteps(config.steps);

      state.prescriptionVisible = true;
      state.isDraft = true;
      state.analysisType = prescription.analysis_code as AnalysisType;
      state.prescriptionId = prescription.analysis_id;
      state.currentStep = config.steps[0];

      // Prescription data in analysisData object

      state.analysisData.analysis = {
        is_reflex: prescription.is_reflex,
        panel_code: prescription.analysis_code,
        comment: prescription.comment,
        resident_supervisor: prescription.resident_supervisor_id,
      };

      if (prescription.diagnosis_hypothesis) {
        state.analysisData.history_and_diagnosis = {
          diagnostic_hypothesis: prescription.diagnosis_hypothesis,
          ethnicity: prescription.ethnicity_code,
          report_health_conditions: !!prescription.history?.length,
          health_conditions: prescription.history?.map((history) => ({
            condition: history.condition,
            parental_link: history.parental_link_code,
          })),
        } as IHistoryAndDiagnosisDataType;
        if (state.analysisData?.history_and_diagnosis && prescription.inbreeding)
          state.analysisData.history_and_diagnosis.inbreeding = prescription.inbreeding;
      }

      function getPatientInfos(
        patient: HybridPatient,
        proband?: HybridPatientPresent,
      ): TPatientFormDataType {
        return {
          [PARENT_DATA_FI_KEY.ENTER_INFO_MOMENT]: (!(patient as HybridPatientNotPresent).status
            ? 'now'
            : (patient as HybridPatientNotPresent).status?.toLowerCase()) as EnterInfoMomentValue,
          [PARENT_DATA_FI_KEY.NO_INFO_REASON]: (patient as HybridPatientNotPresent).reason,
          [PATIENT_DATA_FI_KEY.PATIENT_ID]: (patient as HybridPatientPresent).patient_id,
          [PATIENT_DATA_FI_KEY.PRESCRIBING_INSTITUTION]:
            (patient as HybridPatientPresent).organization_id || proband?.organization_id || '',
          [PATIENT_DATA_FI_KEY.FIRST_NAME]: (patient as HybridPatientPresent).first_name,
          [PATIENT_DATA_FI_KEY.LAST_NAME]: (patient as HybridPatientPresent).last_name,
          [PATIENT_DATA_FI_KEY.NO_FILE]: !(patient as HybridPatientPresent).mrn,
          [PATIENT_DATA_FI_KEY.FILE_NUMBER]: (patient as HybridPatientPresent).mrn,
          [PATIENT_DATA_FI_KEY.RAMQ_NUMBER]: (patient as HybridPatientPresent).jhn,
          [PATIENT_DATA_FI_KEY.NO_RAMQ]: !(patient as HybridPatientPresent).jhn,
          [PATIENT_DATA_FI_KEY.BIRTH_DATE]: (patient as HybridPatientPresent).birth_date,
          [PATIENT_DATA_FI_KEY.SEX]: (
            patient as HybridPatientPresent
          ).sex?.toLowerCase() as SexValue,
        } as any;
      }

      function getClinical(patient: HybridPatientPresent): IClinicalSignsDataType {
        const observedSigns: IClinicalSignItem[] = [];
        const nonObservedSigns: IClinicalSignItem[] = [];
        patient.clinical?.signs?.forEach((sign) =>
          (sign.observed ? observedSigns : nonObservedSigns).push({
            value: sign.code,
            is_observed: sign.observed,
            age_code: sign.age_code,
            name: '',
          }),
        );
        return {
          signs: observedSigns,
          not_observed_signs: nonObservedSigns,
          comment: patient.clinical?.comment,
        };
      }

      function getParaClinical(patient: HybridPatientPresent): IParaclinicalExamsDataType {
        return {
          exams: patient.para_clinical?.exams || [],
          comment: patient.para_clinical?.other,
        };
      }

      const proband = prescription.patients[0] as HybridPatientPresent;
      state.analysisData.patient = getPatientInfos(proband);
      state.analysisData.clinical_signs = getClinical(proband);
      state.analysisData.paraclinical_exams = getParaClinical(proband);

      if (proband.foetus) {
        state.analysisData.patient.additional_info = {
          foetus_gender: proband.foetus.sex?.toLowerCase() as SexValue,
          gestational_age:
            proband.foetus.gestational_method?.toLocaleLowerCase() as GestationalAgeValues,
          gestational_date: proband.foetus.gestational_date,
          is_new_born: proband.foetus.type === 'NEW_BORN',
          is_prenatal_diagnosis: proband.foetus.type === 'PRENATAL',
          mother_ramq: proband.foetus.mother_jhn,
        };
      }

      for (let i = 1; i < prescription.patients.length; i++) {
        const patient = prescription.patients[i];
        const familyMember = {
          ...getPatientInfos(patient, proband),
          ...getParaClinical(patient as HybridPatientPresent),
          ...getClinical(patient as HybridPatientPresent),
        } as any;

        if ((patient as HybridPatientPresent).affected !== undefined) {
          if ((patient as HybridPatientPresent).affected == null) {
            familyMember.parent_clinical_status = 'unknown';
          } else {
            familyMember.parent_clinical_status = (patient as HybridPatientPresent).affected
              ? 'affected'
              : 'not_affected';
          }
        }

        if (patient.family_member === 'FATHER') {
          state.analysisData.father = familyMember;
        } else if (patient.family_member === 'MOTHER') {
          state.analysisData.mother = familyMember;
        }
      }

      state.config = config;
    },
    currentFormRefs: (state, action: PayloadAction<ICurrentFormRefs>) => {
      state.currentFormRefs = action.payload;
    },
    saveSubmissionStepData: (state, action: PayloadAction<ISubmissionStepDataReview>) => {
      if (action.payload.comment) {
        state.analysisData.analysis.comment = action.payload.comment;
      }

      if (action.payload.resident_supervisor) {
        state.analysisData.analysis.resident_supervisor = action.payload.resident_supervisor;
      }
    },
    saveCreatedPrescription: (state, action: PayloadAction<any>) => {
      state.prescriptionId = action.payload?.prescriptionId || undefined;
      state.isDraft = !!action.payload?.isDraft;
      state.analysisData.changed = undefined;
      if (action.payload?.patients) {
        for (const patient of action.payload.patients) {
          switch (patient.family_member) {
            case 'PROBAND':
              if (state.analysisData.patient) state.analysisData.patient.id = patient.id;
              break;
            case 'FATHER':
              if (state.analysisData.father) state.analysisData.father.id = patient.id;
              break;
            case 'MOTHER':
              if (state.analysisData.mother) state.analysisData.mother.id = patient.id;
              break;
          }
        }
      }
    },
  },
  extraReducers: (builder) => {
    // Fetch Config
    builder.addCase(fetchFormConfig.pending, (state) => {
      state.formState.isLoadingConfig = true;
    });
    builder.addCase(fetchFormConfig.fulfilled, (state, action) => {
      state.formState.config = action.payload;
      state.formState.isLoadingConfig = false;
    });
    builder.addCase(fetchFormConfig.rejected, (state) => {
      state.formState.isLoadingConfig = false;
    });

    // Create Prescription
    builder.addCase(createPrescription.pending, (state) => {
      state.isCreatingPrescription = true;
    });
    builder.addCase(createPrescription.fulfilled, (state) => {
      state.isCreatingPrescription = false;
      if (!state.isDraft) state.prescriptionVisible = false;
    });
    builder.addCase(createPrescription.rejected, (state) => {
      state.isCreatingPrescription = false;
    });
  },
});

export const prescriptionFormActions = prescriptionFormSlice.actions;
export const prescriptionFormActionTypes = Object.values(prescriptionFormActions).map(
  (action) => action.type,
);
export default prescriptionFormSlice.reducer;
