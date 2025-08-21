import { STEPS_ID } from 'components/Prescription/Analysis/AnalysisForm/ReusableSteps/constant';
import { IAnalysisConfig } from 'store/prescription/types';

export const TrioAnalysisConfig: IAnalysisConfig = {
  analysisTitle: '',
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
      id: STEPS_ID.MOTHER_IDENTIFICATION,
      title: 'Informations de la mère',
    },
    {
      id: STEPS_ID.FATHER_IDENTIFICATION,
      title: 'Informations du père',
    },
    {
      id: STEPS_ID.PROJECT,
      title: 'Projet de recherche',
    },
    {
      id: STEPS_ID.SUBMISSION,
      title: 'Soumission',
    },
  ],
};
