import intl from 'react-intl-universal';
import { Descriptions, Divider, Typography } from 'antd';
import { extractObservationId, extractOrganizationId, extractPatientId } from 'api/fhir/helper';
import { PatientServiceRequestFragment } from 'api/fhir/models';
import { formatName, formatRamq } from 'api/fhir/patientHelper';
import { useGestationalDateObservationEntity } from 'graphql/prescriptions/actions';

import { EMPTY_FIELD } from 'components/Prescription/Analysis/AnalysisForm/ReusableSteps/constant';
import { calculateGestationalAgeFromDDM, calculateGestationalAgeFromDPA } from 'utils/age';
import { formatDate } from 'utils/date';

interface OwnProps {
  patient: PatientServiceRequestFragment;
  reference?: string;
  isPrenatal?: boolean;
  labelClass?: 'label-20' | 'label-25' | 'label-35';
}

const { Text } = Typography;

const DDM = '8665-2';
const DPA = '11778-8';

const getGestationalAge = (valueDateTime: string, code?: string) => {
  if (!code) {
    return (
      <Descriptions.Item label={intl.get('prescription.patient.identification.gestational.age')}>
        {intl.get('prescription.patient.identification.foetus.dead')}
      </Descriptions.Item>
    );
  }

  const value =
    code === DDM
      ? calculateGestationalAgeFromDDM(new Date(valueDateTime))
      : calculateGestationalAgeFromDPA(new Date(valueDateTime));
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

const GestationalInfo = (gestationalAgeObsReference: string, labelClass: string, code?: string) => {
  const { gestationalDateObervationValue } = useGestationalDateObservationEntity(
    extractObservationId(gestationalAgeObsReference),
  );
  return (
    <>
      <Divider />
      <Descriptions column={1} size="small" className={labelClass}>
        <Descriptions.Item label={intl.get('prescription.patient.identification.sexe.foetus')}>
          {intl.get(`sex.${gestationalDateObervationValue?.focus.resource.gender}`)}
        </Descriptions.Item>
        {getGestationalAge(gestationalDateObervationValue?.valueDateTime, code)}
      </Descriptions>
    </>
  );
};

const PatientContent = ({ patient, reference, isPrenatal, labelClass = 'label-35' }: OwnProps) => {
  let folder = <>{patient.mrn ?? EMPTY_FIELD}</>;
  if (patient.mrn && reference) {
    folder = (
      <>
        {folder} &mdash; {extractOrganizationId(reference)}
      </>
    );
  } else if (reference) {
    folder = <>{extractOrganizationId(reference)}</>;
  }

  let foetusInfo = <></>;

  if (isPrenatal) {
    const observation = patient.clinicalImpressions[0]?.investigation[0]?.item.find(
      (i) => i.item?.code?.coding.code === DDM || i.item?.code?.coding.code === DPA,
    );

    if (observation) {
      foetusInfo = GestationalInfo(
        observation.reference,
        labelClass,
        observation.item?.code?.coding.code,
      );
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
          {extractPatientId(patient.id)}
        </Descriptions.Item>
        <Descriptions.Item label={intl.get('screen.prescription.entity.patientContent.folder')}>
          {folder}
        </Descriptions.Item>
        <Descriptions.Item label="RAMQ">
          {formatRamq(patient.person[0].ramq) ?? EMPTY_FIELD}
        </Descriptions.Item>
        <Descriptions.Item label={intl.get('name')}>
          {formatName(patient.person[0].name[0])}
        </Descriptions.Item>
        <Descriptions.Item label={intl.get('birthdate')}>
          {formatDate(patient.person[0].birthdate)}
        </Descriptions.Item>
        <Descriptions.Item label={intl.get('sex')}>
          {intl.get(`sex.${patient.gender?.toLowerCase()}` ?? 'key')}
        </Descriptions.Item>
      </Descriptions>
      {foetusInfo}
    </>
  ) : null;
};

export default PatientContent;
