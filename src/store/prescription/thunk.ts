import intl from 'react-intl-universal';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { PrescriptionFormApi } from 'api/form';
import { TFormConfig } from 'api/form/models';
import { HybridApi } from 'api/hybrid';
import { HybridPrescription } from 'api/hybrid/models';
import { capitalize } from 'lodash';

import { globalActions } from 'store/global';
import { RootState } from 'store/types';

import { prescriptionFormActions } from './slice';
import { cleanAnalysisData } from './utils';

const fetchFormConfig = createAsyncThunk<TFormConfig, { code: string }>(
  'prescription/fetchFormConfig',
  async (args, thunkApi) => {
    const { data, error } = await PrescriptionFormApi.fetchConfig(args.code);

    if (error) {
      thunkApi.dispatch(
        globalActions.displayNotification({
          message: capitalize(intl.get('notification.error')),
          description: intl.get('notification.error.prescription.form.config'),
          type: 'error',
        }),
      );
      return thunkApi.rejectWithValue(error.response?.config);
    }

    return data!.config;
  },
);

const createPrescription = createAsyncThunk<
  {
    prescriptionId: string;
    patients?: {
      id: string;
      family_member: string;
    }[];
  },
  void,
  { state: RootState }
>('prescription/createPrescription', async (_, thunkApi) => {
  const prescription = thunkApi.getState().prescription;
  const prescriptionData: HybridPrescription = cleanAnalysisData(prescription.analysisData);

  const { data, error } = prescription.prescriptionId
    ? await HybridApi.updatePrescription(
        prescriptionData,
        prescription.prescriptionId,
        prescription.isDraft,
      )
    : await HybridApi.createPrescription(prescriptionData, prescription.isDraft);

  if (error) {
    thunkApi.dispatch(prescriptionFormActions.setSubmissionError(error));
    return thunkApi.rejectWithValue(error.response?.data);
  }

  return {
    prescriptionId: data?.analysis_id!,
    patients: data?.patients,
  };
});

export { fetchFormConfig, createPrescription };
