import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { isUndefined } from 'lodash';

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
      state.analysisData = {
        ...state.analysisData,
        ...action.payload,
      };
    },
    goTo: (
      state,
      action: PayloadAction<{
        index: number;
        lastStepIsNext?: boolean;
      }>,
    ) => {
      state.currentStep = state.config?.steps[action.payload.index];
      state.lastStepIsNext = action.payload.lastStepIsNext;
    },
    goToLastStep: (state) => {
      state.currentStep = state.config?.steps[state.config?.steps.length - 1];
      state.lastStepIsNext = false;
    },
    nextStep: (state) => {
      const nextStepIndex = state.currentStep?.nextStepIndex;
      if (!isUndefined(nextStepIndex)) {
        state.currentStep = state.config?.steps[nextStepIndex];
      }
    },
    previousStep: (state) => {
      const previousStepIndex = state.currentStep?.previousStepIndex;

      if (state.currentFormRefs?.getFieldsValue) {
        state.analysisData = {
          ...state.analysisData,
          ...state.currentFormRefs.getFieldsValue(),
        };
      }

      if (!isUndefined(previousStepIndex)) {
        state.currentStep = state.config?.steps[previousStepIndex];
      }
    },
    cancel: () => ({
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
      let config = getAnalysisConfigMapping(action.payload.type)!;

      config = {
        ...config,
        steps: enrichSteps(config.steps),
      };

      state.analysisData.analysis = {
        panel_code: action.payload.type,
        is_reflex: action.payload.extraData.isReflex ?? false,
      };

      state.analysisType = action.payload.type;
      state.analysisChoiceModalVisible = false;
      state.prescriptionVisible = true;
      state.currentStep = config.steps[0];
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
      state.prescriptionVisible = false;
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
