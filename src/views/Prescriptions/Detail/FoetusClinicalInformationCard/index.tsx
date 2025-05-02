import { TFormConfig } from 'api/form/models';
import { HybridAnalysis } from 'api/hybrid/models';

import ClinicalInformationCard from '../ClinicalInformationCard';

type OwnProps = {
  hybridPrescription?: HybridAnalysis;
  prescriptionConfig?: TFormConfig;
  loading: boolean;
};

const FoetusClinicalInformation = ({
  hybridPrescription,
  prescriptionConfig,
  loading,
}: OwnProps) => (
  <ClinicalInformationCard
    hybridPrescription={hybridPrescription}
    prescriptionConfig={prescriptionConfig}
    loading={loading}
  />
);

export default FoetusClinicalInformation;
