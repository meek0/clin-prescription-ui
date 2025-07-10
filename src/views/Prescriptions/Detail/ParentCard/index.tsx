import intl from 'react-intl-universal';
import GridCard from '@ferlab/ui/core/view/v2/GridCard';
import { Descriptions, Divider, Space, Typography } from 'antd';
import { TFormConfig } from 'api/form/models';
import { HybridPatient, HybridPatientPresent } from 'api/hybrid/models';
import { ClinicalSign } from 'views/Prescriptions/Detail/ClinicalInformationCard/components/ClinicalSign';

import CollapsePanel from 'components/containers/collapse';
import ParagraphLoader from 'components/uiKit/ParagraphLoader';
import { getClinicalStatus } from 'store/prescription/utils';

import PatientContent from '../PatientCard/PatientContent';
import RequestTable from '../RequestTable';

const { Title } = Typography;

interface OwnProps {
  patient: HybridPatient;
  organizationId: string;
  prescriptionConfig?: TFormConfig;
  analysisType?: string;
  loading: boolean;
}

const ParentCard = ({
  patient,
  prescriptionConfig,
  analysisType,
  loading,
  organizationId,
}: OwnProps) => (
  <ParagraphLoader loading={loading} paragraph={{ rows: 6 }}>
    {patient && (
      <CollapsePanel
        header={
          <Title level={4}>{intl.get((patient as HybridPatientPresent).family_member)}</Title>
        }
        datacy={`ParentCard_${intl.get((patient as HybridPatientPresent).family_member)}`}
      >
        <Space direction="vertical" size="large">
          <GridCard
            content={
              <>
                <PatientContent
                  patient={patient}
                  organizationId={organizationId}
                  labelClass="label-20"
                />
                <Divider />
                <Descriptions column={1} size="small" className="label-20">
                  <Descriptions.Item
                    label={intl.get('screen.prescription.entity.parent.affectedStatus')}
                  >
                    {intl.get(getClinicalStatus(patient as HybridPatientPresent))}
                  </Descriptions.Item>
                </Descriptions>
                {(patient as HybridPatientPresent).clinical && (
                  <>
                    <p style={{ marginBottom: '.5em' }} />
                    <ClinicalSign
                      clinical={(patient as HybridPatientPresent).clinical}
                      prescriptionConfig={prescriptionConfig}
                    />
                  </>
                )}
              </>
            }
          />
          <RequestTable
            patient={patient as HybridPatientPresent}
            analysisType={analysisType}
            loading={loading}
          />
        </Space>
      </CollapsePanel>
    )}
  </ParagraphLoader>
);

export default ParentCard;
