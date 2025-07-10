import { ServiceRequestEntity } from 'api/fhir/models';
import { useBasedOnServiceRequests } from 'graphql/prescriptions/actions';

import ClinicalInformationCard from '../ClinicalInformationCard';

type OwnProps = {
  prescription: ServiceRequestEntity;
  prescriptionId: string;
  loading: boolean;
};

const FoetusClinicalInformation = ({ prescription, prescriptionId, loading }: OwnProps) => {
  const { serviceRequests } = useBasedOnServiceRequests(prescriptionId);

  if (prescription.subject.resource)
    prescription.subject.resource.requests = serviceRequests.filter(
      (serviceRequest) => serviceRequest.category?.[0]?.coding[0]?.code === 'Prenatal',
    );
  return <ClinicalInformationCard prescription={prescription} loading={loading} isFoetus />;
};

export default FoetusClinicalInformation;
