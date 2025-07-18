import intl from 'react-intl-universal';
import { Descriptions, Divider, Typography } from 'antd';
import { extractOrganizationId, extractPatientId } from 'api/fhir/helper';
import { formatJhn, formatName } from 'api/fhir/patientHelper';
import { FOETUS_TYPE, HybridPatient, HybridPatientPresent } from 'api/hybrid/models';

import { EMPTY_FIELD } from 'components/Prescription/Analysis/AnalysisForm/ReusableSteps/constant';
import { calculateGestationalAgeFromDDM, calculateGestationalAgeFromDPA } from 'utils/age';
import { formatDate } from 'utils/date';

interface OwnProps {
  patient?: HybridPatient;
  organizationId?: string;
  labelClass?: 'label-20' | 'label-25' | 'label-35';
}

const PatientContent = ({ patient, organizationId, labelClass = 'label-35' }: OwnProps) => {
  const folderInfos = [];
  if ((patient as HybridPatientPresent)?.mrn)
    folderInfos.push((patient as HybridPatientPresent).mrn);
  if (organizationId) folderInfos.push(extractOrganizationId(organizationId));

  const foetus = (patient as HybridPatientPresent)?.foetus;

  return patient ? (
    <>
      <Descriptions column={1} size="small" className={labelClass}>
        <Descriptions.Item label={intl.get('screen.prescription.entity.identifier')}>
          {extractPatientId((patient as HybridPatientPresent).patient_id!)}
        </Descriptions.Item>
        <Descriptions.Item label={intl.get('screen.prescription.entity.patientContent.folder')}>
          {folderInfos.length ? folderInfos.join(' \u2014 ') : EMPTY_FIELD}
        </Descriptions.Item>
        <Descriptions.Item label="RAMQ">
          {formatJhn((patient as HybridPatientPresent).jhn) ?? EMPTY_FIELD}
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
      {foetus?.type === FOETUS_TYPE.PRENATAL ? (
        <>
          <Divider />
          <Descriptions column={1} size="small" className={labelClass}>
            <Descriptions.Item label={intl.get('prescription.patient.identification.sexe.foetus')}>
              {intl.get(`sex.${foetus.sex?.toLowerCase()}`)}
            </Descriptions.Item>
            <Descriptions.Item
              label={intl.get('prescription.patient.identification.gestational.age')}
            >
              <Typography.Text>
                {foetus.gestational_method === 'DECEASED'
                  ? intl.get('prescription.patient.identification.foetus.dead')
                  : intl.get(
                      'prescription.patient.identification.simple.calculated.gestational.age',
                      {
                        value:
                          foetus.gestational_method === 'DDM'
                            ? calculateGestationalAgeFromDDM(new Date(foetus.gestational_date))
                            : calculateGestationalAgeFromDPA(new Date(foetus.gestational_date)),
                      },
                    )}
              </Typography.Text>
            </Descriptions.Item>
          </Descriptions>
        </>
      ) : null}
    </>
  ) : null;
};

export default PatientContent;
