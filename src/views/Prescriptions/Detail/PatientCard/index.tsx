import intl from 'react-intl-universal';
import { Card } from 'antd';
import { HybridPatient, HybridPatientPresent } from 'api/hybrid/models';

import ParagraphLoader from 'components/uiKit/ParagraphLoader';

import PatientContent from './PatientContent';

interface OwnProps {
  patient?: HybridPatient;
  loading: boolean;
  organizationId?: string;
}

const PatientCard = ({ patient, organizationId, loading }: OwnProps) => (
  <Card title={intl.get('screen.prescription.entity.patient.card.title')} data-cy="PatientCard">
    <ParagraphLoader loading={loading} paragraph={{ rows: 6 }}>
      <PatientContent patient={patient as HybridPatientPresent} organizationId={organizationId} />
    </ParagraphLoader>
  </Card>
);

export default PatientCard;
