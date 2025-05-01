import { STEPS_ID } from 'components/Prescription/Analysis/AnalysisForm/ReusableSteps/constant';
import { IAnalysisConfig } from 'store/prescription/types';

export const MuscularDiseaseConfig: IAnalysisConfig = {
  analysisTitle: 'Maladies musculaires',
  steps: [
    {
      id: STEPS_ID.PROBAND_IDENTIFICATION,
      title: 'Identification du patient',
    },
    {
      id: STEPS_ID.PROBAND_CLINICAL,
      title: 'Signes cliniques',
    },
    {
      id: STEPS_ID.PROBAND_PARACLINICAL,
      title: 'Examens paracliniques',
    },
    {
      id: STEPS_ID.HISTORY_AND_DIAGNOSIS,
      title: 'Histoire et hypothèse diagnostique',
    },
    {
      id: STEPS_ID.SUBMISSION,
      title: 'Soumission',
    },
  ],
};
