import intl from 'react-intl-universal';
import { Descriptions, Divider, Typography } from 'antd';
import { extractOrganizationId, extractPatientId } from 'api/fhir/helper';
import { formatName, formatRamq } from 'api/fhir/patientHelper';
import { HybridPatient, HybridPatientFoetus, HybridPatientPresent } from 'api/hybrid/models';

import { EMPTY_FIELD } from 'components/Prescription/Analysis/AnalysisForm/ReusableSteps/constant';
import { calculateGestationalAgeFromDDM, calculateGestationalAgeFromDPA } from 'utils/age';
import { formatDate } from 'utils/date';

interface OwnProps {
  patient?: HybridPatient;
  organizationId?: string;
  isPrenatal?: boolean;
  labelClass?: 'label-20' | 'label-25' | 'label-35';
}

const { Text } = Typography;

const getGestationalAge = (foetus: HybridPatientFoetus) => {
  if (foetus.gestational_method === 'DECEASED') {
    return (
      <Descriptions.Item label={intl.get('prescription.patient.identification.gestational.age')}>
        {intl.get('prescription.patient.identification.foetus.dead')}
      </Descriptions.Item>
    );
  }

  const value =
    foetus.gestational_method === 'DDM'
      ? calculateGestationalAgeFromDDM(new Date(foetus.gestational_date))
      : calculateGestationalAgeFromDPA(new Date(foetus.gestational_date));
  return (
    <Descriptions.Item label={intl.get('prescription.patient.identification.gestational.age')}>
      <Text>
        {intl.get('prescription.patient.identification.simple.calculated.gestational.age', {
          value,
        })}
      </Text>
    </Descriptions.Item>
  );
};

const GestationalInfo = (foetus: HybridPatientFoetus, labelClass: string) => (
  <>
    <Divider />
    <Descriptions column={1} size="small" className={labelClass}>
      <Descriptions.Item label={intl.get('prescription.patient.identification.sexe.foetus')}>
        {intl.get(`sex.${foetus.sex?.toLowerCase()}`)}
      </Descriptions.Item>
      {getGestationalAge(foetus)}
    </Descriptions>
  </>
);

const PatientContent = ({
  patient,
  organizationId,
  isPrenatal,
  labelClass = 'label-35',
}: OwnProps) => {
  let folder = <>{(patient as HybridPatientPresent)?.mrn ?? EMPTY_FIELD}</>;
  if ((patient as HybridPatientPresent)?.mrn && organizationId) {
    folder = (
      <>
        {folder} &mdash; {extractOrganizationId(organizationId)}
      </>
    );
  } else if (organizationId) {
    folder = <>{extractOrganizationId(organizationId)}</>;
  }

  let foetusInfo = <></>;

  if (isPrenatal) {
    const foetus = (patient as HybridPatientPresent).foetus;
    if (foetus) {
      foetusInfo = GestationalInfo(foetus, labelClass);
    } else {
      foetusInfo = (
        <>
          <Divider />
          <Descriptions column={1} size="small" className={labelClass}>
            <Descriptions.Item
              label={intl.get('prescription.patient.identification.gestational.age')}
            >
              {intl.get('prescription.patient.identification.foetus.dead')}
            </Descriptions.Item>
          </Descriptions>
        </>
      );
    }
  }

  return patient ? (
    <>
      <Descriptions column={1} size="small" className={labelClass}>
        <Descriptions.Item label={intl.get('screen.prescription.entity.identifier')}>
          {extractPatientId((patient as HybridPatientPresent).patient_id!)}
        </Descriptions.Item>
        <Descriptions.Item label={intl.get('screen.prescription.entity.patientContent.folder')}>
          {folder}
        </Descriptions.Item>
        <Descriptions.Item label="RAMQ">
          {formatRamq((patient as HybridPatientPresent).jhn) ?? EMPTY_FIELD}
        </Descriptions.Item>
        <Descriptions.Item label={intl.get('name')}>
          {formatName({
            family: (patient as HybridPatientPresent).last_name,
            given: (patient as HybridPatientPresent).first_name,
          })}
        </Descriptions.Item>
        <Descriptions.Item label={intl.get('birthdate')}>
          {formatDate((patient as HybridPatientPresent).birth_date)}
        </Descriptions.Item>
        <Descriptions.Item label={intl.get('sex')}>
          {intl.get(`sex.${(patient as HybridPatientPresent)?.sex?.toLowerCase()}`)}
        </Descriptions.Item>
      </Descriptions>
      {foetusInfo}
    </>
  ) : null;
};

export default PatientContent;
