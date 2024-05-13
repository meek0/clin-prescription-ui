import intl from 'react-intl-universal';
import GridCard from '@ferlab/ui/core/view/v2/GridCard';
import { Descriptions, Divider, Space, Typography } from 'antd';
import { extractPatientId } from 'api/fhir/helper';
import { ServiceRequestEntity, ServiceRequestEntityExtension } from 'api/fhir/models';
import { getPatientAffectedStatus } from 'api/fhir/patientHelper';
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
  const clinicalImpressions =
    extension?.extension?.[1].valueReference?.resource.clinicalImpressions;
  const phenotype: string[] = [];
  let generalObservation = undefined;

  if (clinicalImpressions && clinicalImpressions.length > 0) {
    clinicalImpressions
      .find(
        (impression) =>
          impression.id && validClinicalImpressions.some((i) => impression.id?.startsWith(i)),
      )
      ?.investigation.forEach((inv) => {
        inv.item.forEach((item) => {
          if (get(item, 'item.code.coding.code') === 'OBSG') {
            generalObservation = item.reference;
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
                    patient={extension?.extension[1].valueReference?.resource!}
                    reference={prescription?.subject?.resource?.managingOrganization?.reference}
                    labelClass="label-20"
                  />
                  <Divider />
                  <Descriptions column={1} size="small" className="label-20">
                    <Descriptions.Item
                      label={intl.get('screen.prescription.entity.parent.affectedStatus')}
                    >
                      {intl.get(getPatientAffectedStatus(extension))}
                    </Descriptions.Item>
                  </Descriptions>
                  {(phenotype.length > 0 || generalObservation) && (
                    <>
                      <p style={{ marginBottom: '.5em' }} />
                      <ClinicalSign
                        phenotypeIds={phenotype}
                        generalObervationId={generalObservation}
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
