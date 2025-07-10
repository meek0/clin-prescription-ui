import intl from 'react-intl-universal';
import GridCard from '@ferlab/ui/core/view/v2/GridCard';
import { Descriptions, Divider, Space, Typography } from 'antd';
import { extractPatientId } from 'api/fhir/helper';
import { ServiceRequestEntity, ServiceRequestEntityExtension } from 'api/fhir/models';
import { AFFECTED_STATUS_CODE, AffectedStatusCode } from 'api/fhir/patientHelper';
import { get } from 'lodash';
import { ClinicalSign } from 'views/Prescriptions/Detail/ClinicalInformationCard/components/ClinicalSign';

import CollapsePanel from 'components/containers/collapse';
import ParagraphLoader from 'components/uiKit/ParagraphLoader';

import PatientContent from '../PatientCard/PatientContent';
import RequestTable from '../RequestTable';

const { Title } = Typography;

interface OwnProps {
  extension?: ServiceRequestEntityExtension;
  prescription?: ServiceRequestEntity;
  loading: boolean;
}

const ParentCard = ({ extension, loading, prescription }: OwnProps) => {
  const validClinicalImpressions: string[] = get(prescription, 'supportingInfo', []).map((info) =>
    get(info, 'reference'),
  );
  const patient = extension?.extension?.[1].valueReference?.resource;
  const clinicalImpressions =
    extension?.extension?.[1].valueReference?.resource.clinicalImpressions;
  const phenotype: string[] = [];
  const generalObservation: string[] = [];
  let affectedStatus = '';

  if (clinicalImpressions && clinicalImpressions.length > 0) {
    clinicalImpressions
      .find(
        (impression) =>
          impression.id && validClinicalImpressions.some((i) => impression.id?.startsWith(i)),
      )
      ?.investigation.forEach((inv) => {
        inv.item.forEach((item) => {
          const isMother = extension?.extension?.[0]?.valueCoding?.coding?.[0].code === 'MTH';
          // Exclude observation with focus for mother (it means it's a prenatal request and observation is for the foetus)
          if (item.item?.focus && isMother) return;

          if (get(item, 'item.code.coding.code') === 'DSTA') {
            affectedStatus =
              AFFECTED_STATUS_CODE[
                get(item, 'item.interpretation.coding.code', '') as AffectedStatusCode
              ];
          } else if (get(item, 'item.code.coding.code') === 'OBSG') {
            generalObservation.push(item.reference);
          } else if (get(item, 'item.code.coding.code') === 'PHEN') {
            phenotype.push(item.reference);
          }
        });
      });
  }

  return (
    <ParagraphLoader loading={loading} paragraph={{ rows: 6 }}>
      {extension?.extension?.length && (
        <CollapsePanel
          header={
            <Title level={4}>
              {intl.get(get(extension?.extension[0].valueCoding, 'coding[0].code', ''))}
            </Title>
          }
          datacy={`ParentCard_${intl.get(
            get(extension?.extension[0].valueCoding, 'coding[0].code', ''),
          )}`}
        >
          <Space direction="vertical" size="large">
            <GridCard
              content={
                <>
                  <PatientContent
                    patient={patient!}
                    reference={patient?.managingOrganization?.reference}
                    labelClass="label-20"
                  />
                  <Divider />
                  <Descriptions column={1} size="small" className="label-20">
                    <Descriptions.Item
                      label={intl.get('screen.prescription.entity.parent.affectedStatus')}
                    >
                      {intl.get(affectedStatus)}
                    </Descriptions.Item>
                  </Descriptions>
                  {(phenotype.length > 0 || generalObservation.length) && (
                    <>
                      <p style={{ marginBottom: '.5em' }} />
                      <ClinicalSign
                        isParent
                        phenotypeIds={phenotype}
                        generalObervationIds={generalObservation}
                        isPrenatal={prescription?.category?.[0]?.coding?.[0].code === 'Prenatal'}
                      />
                    </>
                  )}
                </>
              }
            />
            <RequestTable
              patientId={extractPatientId(extension?.extension[1].valueReference?.resource.id!)}
              data={extension?.extension[1].valueReference?.resource?.requests ?? []}
            />
          </Space>
        </CollapsePanel>
      )}
    </ParagraphLoader>
  );
};

export default ParentCard;
