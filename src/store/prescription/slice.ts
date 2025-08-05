import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { HybridAnalysis, HybridPatientPresent } from 'api/hybrid/models';
import { logout } from 'auth/keycloak';
import { RptManager } from 'auth/rpt';
import { isUndefined } from 'lodash';
import _ from 'lodash';

// eslint-disable-next-line max-len
import { TrioAnalysisConfig } from 'store/prescription/analysis/developmentDelay';
import { SoloAnalysisConfig } from 'store/prescription/analysis/muscular';
import { isMuscularAnalysis, isSoloAnalysis } from 'store/prescription/helper';
import {
  AnalysisType,
  IAnalysisConfig,
  IAnalysisStep,
  ICompleteAnalysisChoice,
  ICurrentFormRefs,
  initialState,
  IStartAddingParent,
  ISubmissionStepDataReview,
  TCompleteAnalysis,
} from 'store/prescription/types';

import { getAddParentSteps } from './analysis/addParent';
import { createPrescription, fetchFormConfig } from './thunk';
import { getFormDataFromAnalysis } from './utils';

export const PrescriptionState: initialState = {
  prescriptionVisible: false,
  addParentModalVisible: false,
  analysisChoiceModalVisible: false,
  currentStep: undefined,
  config: undefined,
  isCreatingPrescription: false,
  analysisFormData: {
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
  if (isMuscularAnalysis(type) || isSoloAnalysis(type)) {
    return {
      ...SoloAnalysisConfig,
      analysisTitle: type,
    };
  } else {
    return {
      ...TrioAnalysisConfig,
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
      updateanalysisFormDataFromForm(state, action.payload);
    },
    prescriptionChanged: (state, action: PayloadAction<any>) => {
      state.analysisFormData.changed = action.payload;
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
        updateanalysisFormDataFromForm(state, state.currentFormRefs.getFieldsValue());
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
        updateanalysisFormDataFromForm(state, state.currentFormRefs.getFieldsValue());
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

      state.analysisFormData.analysis = {
        panel_code: action.payload.type,
        is_reflex: action.payload.extraData.isReflex ?? false,
      };
    },
    openFormFromDraft: (state, action: PayloadAction<HybridAnalysis>) => {
      const prescription = action.payload;
      const config = getAnalysisConfigMapping(prescription.analysis_code as AnalysisType)!;
      config.steps = enrichSteps(config.steps);

      state.prescriptionVisible = true;
      state.isDraft = true;
      state.analysisType = prescription.analysis_code as AnalysisType;
      state.prescriptionId = prescription.analysis_id;
      state.currentStep = config.steps[0];

      // Prescription data in analysisFormData object
      state.analysisFormData = getFormDataFromAnalysis(action.payload);

      state.config = config;
    },
    currentFormRefs: (state, action: PayloadAction<ICurrentFormRefs>) => {
      state.currentFormRefs = action.payload;
    },
    saveSubmissionStepData: (state, action: PayloadAction<ISubmissionStepDataReview>) => {
      if (action.payload.comment) {
        state.analysisFormData.analysis.comment = action.payload.comment;
      }

      if (action.payload.resident_supervisor_id) {
        state.analysisFormData.analysis.resident_supervisor_id =
          action.payload.resident_supervisor_id;
      }
    },
    saveCreatedPrescription: (state, action: PayloadAction<any>) => {
      state.prescriptionId = action.payload?.prescriptionId || undefined;
      state.isDraft = !!action.payload?.isDraft;
      state.analysisFormData.changed = undefined;
      if (action.payload?.patients) {
        for (const patient of action.payload.patients) {
          switch (patient.family_member) {
            case 'PROBAND':
              if (state.analysisFormData.proband)
                state.analysisFormData.proband.patient_id = patient.id;
              break;
            case 'FATHER':
              if (state.analysisFormData.father)
                (state.analysisFormData.father as HybridPatientPresent).patient_id = patient.id;
              break;
            case 'MOTHER':
              if (state.analysisFormData.mother)
                (state.analysisFormData.mother as HybridPatientPresent).patient_id = patient.id;
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

function updateanalysisFormDataFromForm(state: initialState, formData: TCompleteAnalysis) {
  // The mergeWith option is used to replace array if array is empty (https://github.com/lodash/lodash/issues/1313)
  state.analysisFormData = _.mergeWith(state.analysisFormData, formData, (obj, src) =>
    !_.isNil(src) ? src : obj,
  );
}
